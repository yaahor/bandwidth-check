import { ConnectedPosition } from '@angular/cdk/overlay';
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
  Renderer2,
  TrackByFunction,
  ViewChild
} from '@angular/core';
import { VideoRecord } from '../../shared/model/video-record';
import { MediaQuality } from './model/media-quality';
import { VideoCamera } from './model/video-camera';

interface QualityOption {
  label: string;
  resolution: number;
  value: MediaQuality;
}

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CameraComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() quality: MediaQuality = MediaQuality.MEDIUM;
  @Output() videoRecorded = new EventEmitter<VideoRecord>();
  @ViewChild('videoElement') private videoElementRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('progressLineElement') private progressLineElementRef?: ElementRef<HTMLProgressElement>;
  @ViewChild('progressValueElement') private progressValueElementRef?: ElementRef<HTMLSpanElement>;

  protected readonly maxRecordDurationSeconds = 10;
  protected isQualityOverlayOpen = false;
  protected trackQualityOption: TrackByFunction<QualityOption> = (_, option) => option.value;
  private recordingTimeout?: number;
  private recordingStartTimestamp = 0;
  private animationFrameId?: number;

  protected get isRecording(): boolean {
    return this.camera?.isRecording ?? false;
  }

  private camera?: VideoCamera;

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly ngZone: NgZone,
    private readonly renderer: Renderer2,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.camera = new VideoCamera(this.quality);

    this.camera.setOnVideoRecorded((blob) => {
      const timestamp = Date.now();
      const durationMs= timestamp - this.recordingStartTimestamp;

      this.ngZone.run(() => {
        this.videoRecorded.emit({ blob, durationMs, timestamp});
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
    this.recordingStartTimestamp = Date.now();

    // Start the animation frame loop
    this.updateProgress();

    // Set timeout to stop recording after MAX_DURATION
    this.recordingTimeout = window.setTimeout(() => {
      this.stopRecording();
    }, this.maxRecordDurationSeconds * 1000);
  }

  protected stopRecording(): void {
    if (this.recordingTimeout) {
      window.clearTimeout(this.recordingTimeout);
      this.recordingTimeout = undefined;
    }
    if (this.animationFrameId) {
      window.cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = undefined;
    }
    this.camera?.stopRecording();
    this.changeDetectorRef.detectChanges();
  }

  private updateProgress(): void  {
    const elapsedMilliseconds = Date.now() - this.recordingStartTimestamp;
    const elapsedSeconds = elapsedMilliseconds / 1000;
    const elapsedSecondsString = elapsedSeconds.toFixed(1);

    this.renderer.setAttribute(this.progressLineElementRef?.nativeElement, 'value', elapsedSeconds.toFixed(3));
    this.renderer.setProperty(this.progressValueElementRef?.nativeElement, 'textContent', `${elapsedSecondsString}s`);

    if (this.isRecording) {
      this.animationFrameId = window.requestAnimationFrame(() => this.updateProgress());
    }
  }

  protected readonly qualities: QualityOption[] = [
    { value: MediaQuality.LOW, resolution: 360, label: 'Low Quality' },
    { value: MediaQuality.MEDIUM, resolution: 720, label: 'Medium Quality' },
    { value: MediaQuality.HIGH, resolution: 1080, label: 'High Quality' }
  ];

  protected toggleQualityOverlay(): void {
    this.isQualityOverlayOpen = !this.isQualityOverlayOpen;
  }

  protected selectQuality(quality: MediaQuality): void {
    this.quality = quality;
    this.isQualityOverlayOpen = false;
    // todo change video quality
  }

  protected readonly overlayPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'start', overlayY: 'bottom', offsetX: 12 },
  ];
}
