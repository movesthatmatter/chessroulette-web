import { AsyncResultWrapper, Ok } from 'dstnd-io';

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
};

type DestroyStreamFn = () => void;

// Note: As of Dec 5h, 2020, It currently doesn't seperate the Audio from Video if needed in the future!
class AVStreamingClass {
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
    this.pendingStreamCreationPromise = navigator.mediaDevices.getUserMedia(constraints);

    const stream = await this.pendingStreamCreationPromise;

    this.activeStreamsById[stream.id] = stream;

    // Reset it again!
    this.pendingStreamCreationPromise = undefined;

    return stream;
  }

  destroyStreamById(streamId: string) {
    const { [streamId]: stream, ...restActiveStreams } = this.activeStreamsById;

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });

      // Remove the stream from active
      this.activeStreamsById = restActiveStreams;
    }
  }

  // This is important because cloning requires permissions on some browsers
  //  so adding a delay highers the possibility to reuse one!
  // TODO: As of 12/09/2020 I haven't found a way to stop and restart the
  //  same getUserMedia stream, but if that would work than all we would need
  //  is to create one!
  destroyStreamByIdWithDelay(streamId: string, ms = 250) {
    setTimeout(() => {
      this.destroyStreamById(streamId);
    }, ms);
  }

  private cloneStream(stream: MediaStream) {
    const clonedStream = stream.clone();

    this.activeStreamsById[clonedStream.id] = clonedStream;

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

export type AVStreaming = AVStreamingClass;

let instance: AVStreaming;
export const getAVStreaming = () => {
  if (!instance) {
    instance = new AVStreamingClass();
  }

  return instance;
};