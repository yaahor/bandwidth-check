import { ChangeDetectionStrategy, Component, ElementRef, OnInit, TrackByFunction, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MediaQuality } from '../features/camera/model/media-quality';
import { VideoRecord } from '../shared/model/video-record';
import { getDownloadSpeedMbps } from './lib/get-download-speed-mbps';
import { mapSpeedMbpsToMediaQuality } from './lib/map-speed-mbps-to-media-quality';
import { AddVideoRecord, GetVideoRecords, RecordedVideosState, RemoveVideoRecord } from './model/recorded-videos.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @Select(RecordedVideosState.getVideos) protected records$!: Observable<VideoRecord[]>;
  @ViewChild('playerVideo') videoElement?: ElementRef<HTMLVideoElement>;
  protected isPlaying = false;

  protected activeRecord?: VideoRecord;
  protected quality?: Promise<MediaQuality>;
  protected readonly trackRecord: TrackByFunction<VideoRecord> = (_, record) => record.timestamp;
  protected url?: string;
  protected currentTime = 0;
  protected currentPercentage = 0;
  protected removedRecord?: VideoRecord;


  constructor(private store: Store) {
  }

  async ngOnInit() {
    this.store.dispatch(new GetVideoRecords());
    this.quality = getDownloadSpeedMbps().then(mapSpeedMbpsToMediaQuality);
  }

  protected onCloseClick(): void {
    this.deactivateRecord()
  }


  protected onVideoRecorded(record: VideoRecord): void {
    this.store.dispatch(new AddVideoRecord(record));
  }

  protected onRecordActivated(record: VideoRecord): void {
    this.deactivateRecord()

    this.activeRecord = record;
    this.url = URL.createObjectURL(record.blob);
  }

  protected deactivateRecord(): void {
    this.activeRecord = undefined;

    if (this.url) {
      URL.revokeObjectURL(this.url);
    }

    this.url = undefined;
    this.resetVideo();
  }

  protected onRecordRemoved(record: VideoRecord): void {
    this.removedRecord = record;
  }

  protected togglePlayback(): void {
    const video = this.videoElement?.nativeElement;
    if (!video) return;

    if (video.paused) {
      video.play().then();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  protected onVideoEnded(): void {
    this.resetVideo();
  }

  protected onTimeUpdate(event: Event): void {
    const video = event.target as HTMLVideoElement;
    this.currentTime = video.currentTime;
    this.currentPercentage = this.activeRecord?.durationMs ? (video.currentTime * 1000 / this.activeRecord?.durationMs) * 100 : 0;

  }

  protected onDialogCancel(): void {
    this.removedRecord = undefined;
  }

  protected onDialogDelete(): void {
    if (this.removedRecord) {
      this.store.dispatch(new RemoveVideoRecord(this.removedRecord));
    }

    this.removedRecord = undefined;
  }

  private resetVideo(): void {
    this.videoElement?.nativeElement.pause()
    this.isPlaying = false;
    this.currentTime = 0;
    this.currentPercentage = 0;
  }
}
