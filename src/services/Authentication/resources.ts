import { Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const {
  resource: emailVerificationResource,
} = Resources.Collections.Authentication.EmailVerification;

export const verifyEmail = (req: Resources.Util.RequestOf<typeof emailVerificationResource>) => {
  return emailVerificationResource
    .request(req, (data) => http.post('api/auth/verify-email', data));
}

const { resource: userCheckResource } = Resources.Collections.Authentication.UserCheck;

export const checkUser = (req: Resources.Util.RequestOf<typeof userCheckResource>) => {
  return userCheckResource.request(req, (data) => http.post('/api/auth', data));
}

const {
  resource: userRegistrationResource,
} = Resources.Collections.Authentication.UserRegistration;

export const createUser = (req: Resources.Util.RequestOf<typeof userRegistrationResource>) => {
  return userRegistrationResource.request(req, (data) => http.post('/api/auth/register', data));
}

const { resource: getUserResource } = Resources.Collections.User.GetUser;

export const getUser = () => {
  return getUserResource.request(undefined, () => {
    return http.get('/api/users');
  });
}

const {
  resource: guestAuthenticationResource,
} = Resources.Collections.Authentication.GuestAuthentication;

export const authenticateAsNewGuest = () => {
  return guestAuthenticationResource.request({
    guestUser: null,
  }, (data) => http.post('/api/auth/guest', data));
}

export const authenticateAsExistentGuest = (
  req: Resources.Util.RequestOf<typeof guestAuthenticationResource>
) => {
  return guestAuthenticationResource.request(req, (data) => http.post('/api/auth/guest', data));
}

const {
  resource: connectExternalAccountResource,
} = Resources.Collections.User.ConnectExternalAccount;

export const connectExternalAccount = (
  req: Resources.Util.RequestOf<typeof connectExternalAccountResource>,
) => {
  return connectExternalAccountResource
    .request(req, (data) => http.post(`api/users/connect-external-account`, data));
}
