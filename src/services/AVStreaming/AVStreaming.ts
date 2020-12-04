/* eslint-disable @typescript-eslint/no-unused-expressions */
import { AsyncResultWrapper, Ok } from 'dstnd-io';

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
};

export class AVStreaming {
  public stream?: MediaStream;

  async start(
    constraints: AVStreamingConstraints = {
      video: true,
      audio: true,
    }
  ) {
    return navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      stream.getVideoTracks().forEach((track) => {
        const constraints = track.getConstraints();
  
        console.log('constraints new', constraints);
  
        // constraints.frameRate = 12;
        // track.applyConstraints({
        //   ...constraints,
        //   // frameRate: 24,
        // })
      });
  
      return stream;
    })
  }

  async stop(stream: MediaStream) {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

export const getAVStream = (
  constraints: AVStreamingConstraints = {
    video: true,
    audio: true,
  }
) => {
  return navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    stream.getVideoTracks().forEach((track) => {
      const constraints = track.getConstraints();

      console.log('constraints new', constraints);

      // constraints.frameRate = 12;
      track.applyConstraints({
        ...constraints,
        frameRate: 12,
      })
    });

    return stream;
  })
};

export const removeAVStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

export const isAVPermissionGranted = (
  constraints: AVStreamingConstraints = {
    video: true,
    audio: true,
  }
) => {
  return new AsyncResultWrapper<boolean, null>(() => {
    return getAVStream(constraints)
      .then((stream) => {
        removeAVStream(stream);

        return new Ok(true);
      })
      .catch(() => new Ok(false));
  });
};
