import { MediaQuality } from '../model/media-quality';

export function getMediaStream(quality: MediaQuality): Promise<MediaStream> {
  const constraints = getMediaStreamConstraints(quality);

  return navigator.mediaDevices.getUserMedia(constraints);
}

function getMediaStreamConstraints(quality: MediaQuality): MediaStreamConstraints {
  return {
    video: {
      ...getVideoConstraints(quality),
      facingMode: 'user'
    },
    audio: true
  };
}

function getVideoConstraints(quality: MediaQuality): MediaTrackConstraints {
  switch (quality) {
    case MediaQuality.HIGH:
      return {
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      };
    case MediaQuality.MEDIUM:
      return {
        width: { ideal: 1280 },
        height: { ideal: 720 }
      };
    case MediaQuality.LOW:
      return {
        width: { ideal: 640 },
        height: { ideal: 360 }
      };
  }
}
