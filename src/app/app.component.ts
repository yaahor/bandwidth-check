import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, TrackByFunction } from '@angular/core';
import { MediaQuality } from '../features/camera/model/media-quality';
import { VideoRecord } from '../shared/model/video-record';
import { getDownloadSpeedMbps } from './lib/get-download-speed-mbps';
import { mapSpeedMbpsToMediaQuality } from './lib/map-speed-mbps-to-media-quality';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  protected quality?: Promise<MediaQuality>;
  protected records: VideoRecord[] = [];
  protected readonly trackRecord: TrackByFunction<VideoRecord> = (_, record) => record.timestamp;

  async ngOnInit() {
    this.quality = getDownloadSpeedMbps().then(mapSpeedMbpsToMediaQuality);
  }

  ngOnDestroy() {
    this.records.forEach(record => {
      URL.revokeObjectURL(record.url);
    });
  }

  protected onVideoRecorded(blob: Blob): void {
    const record = { blob, timestamp: Date.now(), url: URL.createObjectURL(blob) };
    this.records = [...this.records, record];
  }
}
