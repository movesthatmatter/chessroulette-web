
// TODO: This is actually exactly UserCheckResponsePayload
export type UserAccountInfo = {
  type: 'internal';
  email: string;
  verificationCode: string;
} | {
  type: 'external';
  vendor: 'lichess' | 'facebook' | 'twitch';
  accessToken: string;
};
