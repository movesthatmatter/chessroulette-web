/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AsyncResultWrapper, Ok } from 'dstnd-io';

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
};

class AVStreaming {
  private _stream?: MediaStream;

  private async createStream(constraints: AVStreamingConstraints) {
    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this._stream = stream;

        return stream;
      });
  }

  async getStream(constraints: AVStreamingConstraints = {
    video: true,
    audio: true,
  }): Promise<MediaStream> {
    if (!this._stream) {
      return this.createStream(constraints).then((stream) => stream.clone());
    }

    return Promise.resolve(this._stream.clone());
  }

  stopStream(stream: MediaStream) {
    stream.getTracks().forEach((track) => {
      track.stop();
    });
  }

  hasPermission(constraints: AVStreamingConstraints = {
    video: true,
    audio: true,
  }) {
    return new AsyncResultWrapper<boolean, null>(() => {
      if (this._stream) {
        return Promise.resolve(new Ok(true));
      }

      return this.createStream(constraints)
        .then(
          () => new Ok(true),
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
