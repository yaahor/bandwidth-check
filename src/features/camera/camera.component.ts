import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
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

  protected readonly MAX_DURATION = 10000; // 10 seconds in milliseconds
  private recordingTimeout?: number;
  private recordingStartTime = 0;
  private animationFrameId?: number;

  protected get isRecording(): boolean {
    return this.camera?.isRecording ?? false;
  }

  private camera?: VideoCamera;

  protected recordingProgress = 0;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone
  ) {
  }

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
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
    }
    this.camera?.turnOff();
  }

  protected startRecordingWithTimeout() {
    this.camera?.startRecording();
    this.recordingProgress = 0;
    this.recordingStartTime = performance.now();

    // Start the animation frame loop
    this.ngZone.runOutsideAngular(() => {
      this.updateProgress();
    });

    // Set timeout to stop recording after MAX_DURATION
    this.recordingTimeout = window.setTimeout(() => {
      this.ngZone.run(() => {
        this.stopRecording();
      });
    }, this.MAX_DURATION);
  }

  private updateProgress = () => {
    const currentTime = performance.now();
    const elapsed = currentTime - this.recordingStartTime;

    this.recordingProgress = Math.min(100, (elapsed / this.MAX_DURATION) * 100);

    if (this.isRecording) {
      this.animationFrameId = window.requestAnimationFrame(this.updateProgress);
    }
  };

  protected stopRecording() {
    if (this.recordingTimeout) {
      window.clearTimeout(this.recordingTimeout);
      this.recordingTimeout = undefined;
    }
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.recordingProgress = 0;
    this.camera?.stopRecording();
    this.changeDetectorRef.detectChanges();
  }
}
