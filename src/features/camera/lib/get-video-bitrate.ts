import { MediaQuality } from '../model/media-quality';

export function getVideoBitrate(quality: MediaQuality) {
  switch (quality) {
    case MediaQuality.HIGH:
      return 2500000; // 2.5 Mbps for 1080p
    case MediaQuality.MEDIUM:
      return 1500000; // 1.5 Mbps for 720p
    case MediaQuality.LOW:
      return 800000;  // 800 Kbps for 360p
    default:
      return 1500000; // Default to medium quality
  }
}
