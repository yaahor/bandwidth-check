import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { MediaQuality } from '../features/camera/model/media-quality';
import { VideoRecord } from '../shared/model/video-record';
import { getDownloadSpeedMbps } from './lib/get-download-speed-mbps';
import { mapSpeedMbpsToMediaQuality } from './lib/map-speed-mbps-to-media-quality';
import { AddVideoRecord, GetVideoRecords, RecordedVideosState } from './model/recorded-videos.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  @Select(RecordedVideosState.getVideos) protected records$!: Observable<VideoRecord[]>;
  protected quality?: Promise<MediaQuality>;
  protected readonly trackRecord: TrackByFunction<VideoRecord> = (_, record) => record.timestamp;

  constructor(private store: Store) {}

  async ngOnInit() {
    this.store.dispatch(new GetVideoRecords());
    this.quality = getDownloadSpeedMbps().then(mapSpeedMbpsToMediaQuality);
  }

  protected onVideoRecorded(blob: Blob): void {
    const record: VideoRecord = { blob, timestamp: Date.now() };
    this.store.dispatch(new AddVideoRecord(record));
  }
}
