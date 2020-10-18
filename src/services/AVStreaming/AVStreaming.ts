/* eslint-disable @typescript-eslint/no-unused-expressions */

export type AVStreamingConstraints = {
  video: boolean;
  audio: boolean;
}

export class AVStreaming {
  public stream?: MediaStream;

  async start(constraints: AVStreamingConstraints = {
    video: true,
    audio: true,
  }) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  async stop(stream: MediaStream) {
    stream?.getTracks().forEach((track) => {
      track.stop();
    });
  }
}

export const getAVStream = (constraints: AVStreamingConstraints = {
  video: true,
  audio: true,
}) => {
  return navigator.mediaDevices.getUserMedia(constraints);
}

export const removeAVStream = (stream: MediaStream) => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}