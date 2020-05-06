import { Pubsy } from 'src/lib/Pubsy';


export class AVStreaming {
  private pubsy = new Pubsy<{
    onStart: MediaStream;
    onStop: void;
  }>();

  private stream?: MediaStream;

  hasStarted() {
    return !!this.stream;
  }

  async start() {
    if (this.stream) {
      return this.stream;
    }

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });

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
