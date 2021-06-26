export type WindowWithOnTokenReceived = typeof window.self & {
  onTokenReceivedFacebook?: (token: string) => void;
  onTokenReceivedLichess?: (token: string) => void;
  onTokenReceivedTwitch?: (token:string) => void;
};
