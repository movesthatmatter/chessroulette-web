export type WindowWithOnTokenReceived = typeof window.self & {
  onTokenReceived?: (token: string) => void;
};
