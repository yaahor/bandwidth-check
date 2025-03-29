import { MediaQuality } from '../../features/camera/model/media-quality';

export function mapSpeedMbpsToMediaQuality(speedMbps: number): MediaQuality {
  if (speedMbps < 2) {
    return MediaQuality.LOW;
  }
  if (speedMbps < 5) {
    return MediaQuality.MEDIUM;
  }

  return MediaQuality.HIGH;
}
