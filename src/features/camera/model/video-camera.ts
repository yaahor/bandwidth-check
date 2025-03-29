import { getMediaStream } from '../lib/get-media-stream';
import { getVideoBitrate } from '../lib/get-video-bitrate';
import { MediaQuality } from './media-quality';

export class VideoCamera {
  get isRecording(): boolean {
    return !!this.mediaRecorder?.state && this.mediaRecorder?.state !== 'inactive';
  }

  private mediaRecorder?: MediaRecorder;
  private recordedChunks: Blob[] = [];
  private stream?: MediaStream;
  private onVideoRecorded?: (blob: Blob) => void;

  constructor(public readonly quality: MediaQuality) {}

  async turnOn(): Promise<MediaStream> {
    return this.stream = await getMediaStream(this.quality);
  }

  setOnVideoRecorded(onVideoRecorded: (blob: Blob) => void): void {
    this.onVideoRecorded = onVideoRecorded;
  }

  turnOff(): void {
    this.stream?.getTracks().forEach(track => track.stop());
    this.stream = undefined;

    this.onVideoRecorded = undefined;

    if (this.mediaRecorder) {
      // todo? remove onstop
    }

    this.stopRecording();
  }

  startRecording(): void {
    if (!this.stream || this.isRecording) {
      return;
    }

    this.recordedChunks = [];

    const options = {
      mimeType: 'video/webm;codecs=vp9',
      videoBitsPerSecond: getVideoBitrate(this.quality),
    };

    this.mediaRecorder = new MediaRecorder(this.stream, options);

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordedChunks.push(event.data);
      }
    };

    this.mediaRecorder.onstop = () => {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });

      if (this.onVideoRecorded) {
        this.onVideoRecorded(blob);
      }
    };

    this.mediaRecorder.start();
  }

  stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder = undefined;
    }
  }
}
