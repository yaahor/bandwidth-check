import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy, OnInit,
  Output, ViewChild
} from '@angular/core';
import { MediaQuality } from './model/media-quality';
import { VideoCamera } from './model/video-camera';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() quality: MediaQuality = MediaQuality.MEDIUM;
  @Output() videoRecorded = new EventEmitter<Blob>();

  @ViewChild('videoElement') private videoElementRef?: ElementRef<HTMLVideoElement>;

  private readonly MAX_DURATION = 10000; // 10 seconds in milliseconds
  private recordingTimeout?: number;

  protected get isRecording(): boolean {
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
  }

  async ngAfterViewInit(): Promise<void> {
    if (this.videoElementRef) {
      this.videoElementRef.nativeElement.srcObject = await this.camera?.turnOn() ?? null;
    }
  }

  ngOnDestroy(): void {
    if (this.recordingTimeout) {
      window.clearTimeout(this.recordingTimeout);
    }
    this.camera?.turnOff();
  }

  protected toggleRecording() {
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
