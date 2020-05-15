import { Pubsy } from 'src/lib/Pubsy';

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
}

export class AVStreaming {
  private pubsy = new Pubsy<{
    onStart: MediaStream;
    onStop: void;
  }>();

  public stream?: MediaStream;

  hasStarted() {
    return !!this.stream;
  }

  async start(constraints: AVStreamingConstraints = {
    video: true,
    audio: false,
  }) {
    if (this.stream) {
      return this.stream;
    }

    this.stream = await navigator.mediaDevices.getUserMedia(constraints);

    // This might need more stuff

    this.pubsy.publish('onStart', this.stream);

    return this.stream;
  }

  async stop() {
    this.stream?.getTracks().forEach((track) => {
      track.stop();
    });

    this.stream = undefined;

    this.pubsy.publish('onStop', undefined);
  }

  onStart(fn: (stream: MediaStream) => void) {
    return this.pubsy.subscribe('onStart', fn);
  }

  onStop(fn: () => void) {
    return this.pubsy.subscribe('onStop', fn);
  }
}
