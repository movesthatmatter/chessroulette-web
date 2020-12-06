import { AsyncResultWrapper, Ok } from 'dstnd-io';

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
};

type DestroyStreamFn = () => void;

// Note: As of Dec 5h, 2020, It currently doesn't seperate the Audio from Video if needed in the future!
class AVStreaming {
  private pendingStreamCreationPromise?: Promise<MediaStream>;

  public activeStreamsById: {
    [id: string]: MediaStream;
  } = {};

  private getAnActiveStream = () => {
    const firstActiveStreamId = Object.keys(this.activeStreamsById)[0];

    if (!firstActiveStreamId) {
      return undefined;
    }

    return this.activeStreamsById[firstActiveStreamId];
  }

  private hasActiveStream() {
    return !!this.getAnActiveStream();
  }

  private async createStream(constraints: AVStreamingConstraints): Promise<MediaStream> {
    console.log('[AVStreaming] creating new stream');

    this.pendingStreamCreationPromise = navigator.mediaDevices.getUserMedia(constraints);

    const stream = await this.pendingStreamCreationPromise;

    this.activeStreamsById[stream.id] = stream;

    // Reset it again!
    this.pendingStreamCreationPromise = undefined;

    console.log('[AVStreaming] active', Object.keys(instance.activeStreamsById).length, this.activeStreamsById);

    return stream;
  }

  destroyStreamById(streamId: string) {
    console.log('[AVStreaming] destroyStreamById', streamId);
    const { [streamId]: stream, ...restActiveStreams } = this.activeStreamsById;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });

      // Remove the stream from active
      this.activeStreamsById = restActiveStreams;
    }

    console.log('[AVStreaming] active', Object.keys(instance.activeStreamsById).length, this.activeStreamsById);
  }

  private cloneStream(stream: MediaStream) {
    const clonedStream = stream.clone();
    console.log('[AVStreaming] cloning stream', stream?.id);

    this.activeStreamsById[clonedStream.id] = clonedStream;

    console.log('[AVStreaming] active', Object.keys(instance.activeStreamsById).length, this.activeStreamsById);

    return clonedStream;
  }

  private cloneAnActiveStream(constraints: AVStreamingConstraints) {
    const stream = this.getAnActiveStream();

    if (!stream) {
      throw new Error('No active stream found!');
    }

    return this.cloneStream(stream);
  }

  async getStream(
    constraints: AVStreamingConstraints = {
      video: true,
      audio: true,
    }
  ): Promise<MediaStream> {
    console.log('[AVStreaming] getStream');

    if (this.pendingStreamCreationPromise) {
      return this
        .pendingStreamCreationPromise
        .then((stream) => {
          // Cloning here is imperative, otherwise all of the calls get the
          //  same stream resulting in freezing on Safari
          return this.cloneStream(stream)
        });
    }
    else if (this.hasActiveStream()) {
      return this.cloneAnActiveStream(constraints);
    } else {
      return this.createStream(constraints);
    }
  }

  hasPermission(
    constraints: AVStreamingConstraints = {
      video: true,
      audio: true,
    }
  ) {
    return new AsyncResultWrapper<boolean, null>(() => {
      if (this.hasActiveStream()) {
        return Promise.resolve(new Ok(true));
      }

      return this
        .createStream(constraints)
        .then(
          (stream) => {
            // Destroy the streamer right away
            this.destroyStreamById(stream.id);

            return new Ok(true);
          },
          () => {
            // TOOO: Check the error because it might be something else then permission
            return new Ok(false);
          }
        );
    });
  }
}

let instance: AVStreaming;
export const getAVStreaming = () => {
  if (!instance) {
    instance = new AVStreaming();
  }

  return instance;
};