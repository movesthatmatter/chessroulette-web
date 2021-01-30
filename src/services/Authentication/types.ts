export type UserAccountInfo = {
  type: 'internal';
  email: string;
  verificationCode: string;
} | {
  type: 'external';
  externalVendor: 'lichess' | 'facebook';
  externalUserId: string;
  email?: string;
  firstName?: string;
  lastName?: string;
};
