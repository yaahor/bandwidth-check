import {
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MediaQuality } from './model/media-quality';
import { VideoCamera } from './model/video-camera';

@Directive({
  selector: 'video[appCamera]',
  exportAs: 'appCamera'
})
export class CameraDirective implements OnInit, OnDestroy {
  @Input() quality: MediaQuality = MediaQuality.MEDIUM;
  @Output() videoRecorded = new EventEmitter<Blob>();

  private readonly MAX_DURATION = 10000; // 10 seconds in milliseconds
  private recordingTimeout?: number;

  get isRecording(): boolean {
    return this.camera?.isRecording ?? false;
  }

  private camera?: VideoCamera;

  constructor(
    private readonly elementRef: ElementRef<HTMLVideoElement>,
    private readonly ngZone: NgZone
  ) {}

  async ngOnInit(): Promise<void> {
    this.camera = new VideoCamera(this.quality);

    this.camera.setOnVideoRecorded((blob) => {
      this.ngZone.run(() => {
        this.videoRecorded.emit(blob);
      });
    });

    this.elementRef.nativeElement.srcObject = await this.camera.turnOn();
  }

  ngOnDestroy(): void {
    if (this.recordingTimeout) {
      window.clearTimeout(this.recordingTimeout);
    }
    this.camera?.turnOff();
  }

  async toggleRecording() {
    if (!this.camera) return;

    if (!this.camera.isRecording) {
      this.startRecordingWithTimeout();
    } else {
      this.stopRecording();
    }
  }

  private startRecordingWithTimeout() {
    this.camera?.startRecording();
    
    // Set timeout to stop recording after MAX_DURATION
    this.recordingTimeout = window.setTimeout(() => {
      this.ngZone.run(() => {
        this.stopRecording();
      });
    }, this.MAX_DURATION);
  }

  private stopRecording() {
    if (this.recordingTimeout) {
      window.clearTimeout(this.recordingTimeout);
      this.recordingTimeout = undefined;
    }
    this.camera?.stopRecording();
  }
}