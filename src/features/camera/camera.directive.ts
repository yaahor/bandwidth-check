import {
  Directive,
  ElementRef,
  EventEmitter,
  Input, NgZone,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { MediaQuality } from './model/media-quality';
import { VideoCamera } from './model/video-camera';
import { VideoRecord } from './model/video-record';

@Directive({
  selector: 'video[appCamera]',
  exportAs: 'appCamera'
})
export class CameraDirective implements OnInit, OnDestroy {
  @Input() quality: MediaQuality = MediaQuality.MEDIUM;
  @Output() videoRecorded = new EventEmitter<VideoRecord>(true);

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
        this.videoRecorded.emit({ blob, timestamp: Date.now() });
      })
    });

    this.elementRef.nativeElement.srcObject = await this.camera.turnOn();
  }

  ngOnDestroy(): void {
    this.camera?.turnOff();
  }

  async toggleRecording() {
    if (!this.camera) return;

    if (!this.camera.isRecording) {
      this.camera.startRecording();
    } else {
      this.camera.stopRecording();
    }
  }
}
