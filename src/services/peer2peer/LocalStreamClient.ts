import PubSub from 'pubsub-js';


enum PubSubChannels {
  onStart = 'ON_START',
  onStop = 'ON_STOP',
}

export class LocalStreamClient {
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

    PubSub.publish(PubSubChannels.onStart, this.stream);

    return this.stream;
  }

  async stop() {
    this.stream?.getTracks().forEach((track) => {
      track.stop();
    });

    this.stream = undefined;

    PubSub.publish(PubSubChannels.onStop, null);
  }

  onStart(fn: (stream: MediaStream) => void) {
    const token = PubSub.subscribe(
      PubSubChannels.onStart,
      (_: string, stream: MediaStream) => fn(stream),
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }

  onStop(fn: () => void) {
    const token = PubSub.subscribe(
      PubSubChannels.onStop,
      () => fn(),
    );

    return () => {
      PubSub.unsubscribe(token);
    };
  }
}
