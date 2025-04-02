import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
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

  protected activeRecord?: VideoRecord;
  protected quality?: Promise<MediaQuality>;
  protected readonly trackRecord: TrackByFunction<VideoRecord> = (_, record) => record.timestamp;
  protected url?: string;

  constructor(private store: Store) {}

  async ngOnInit() {
    this.store.dispatch(new GetVideoRecords());
    this.quality = getDownloadSpeedMbps().then(mapSpeedMbpsToMediaQuality);
  }

  protected onCloseClick(): void {
    if (this.url) {
      URL.revokeObjectURL(this.url);
    }

    this.activeRecord = undefined;
    this.url = undefined;
  }


  protected onVideoRecorded(record: VideoRecord): void {
    this.store.dispatch(new AddVideoRecord(record));
  }

  protected onRecordActivated(record: VideoRecord): void {
    this.activeRecord = record;
    this.url = URL.createObjectURL(record.blob);
  }

  protected onRecordRemoved(record: VideoRecord): void {
    this.store.dispatch(new RemoveVideoRecord(record));
  }
}
