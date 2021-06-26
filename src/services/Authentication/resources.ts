import { AsyncResultWrapper, Err, Ok, Resources } from 'dstnd-io';
import { http } from 'src/lib/http';

const {
  resource: emailVerificationResource,
} = Resources.Collections.Authentication.EmailVerification;

export const verifyEmail = (req: Resources.Util.RequestOf<typeof emailVerificationResource>) => {
  return emailVerificationResource.request(req, (data) => http.post('api/auth/verify-email', data));
};

// Rename this resurce to !authenticate instead of UserCheck!
const { resource: userCheckResource } = Resources.Collections.Authentication.Authenticate;

export const authenticate = (req: Resources.Util.RequestOf<typeof userCheckResource>) => {
  return userCheckResource.request(req, (data) => http.post('/api/auth', data))
};

const {
  resource: userRegistrationResource,
} = Resources.Collections.Authentication.UserRegistration;

export const createUser = (req: Resources.Util.RequestOf<typeof userRegistrationResource>) => {
  return userRegistrationResource.request(req, (data) => http.post('/api/auth/register', data));
};

const { resource: userUpdateResource } = Resources.Collections.User.UserUpdate;

export const updateUser = (req: Resources.Util.RequestOf<typeof userUpdateResource>) => {
  return userUpdateResource.request(req, (data) => {
    return http.post('/api/users', data);
  });
};
const { resource: getUserResource } = Resources.Collections.User.GetUser;

export const getUser = () => {
  return getUserResource.request(undefined, () => {
    return http.get('/api/users');
  });
};

const {
  resource: guestAuthenticationResource,
} = Resources.Collections.Authentication.GuestAuthentication;

// TODO: Does the name for this make sense? is it authenticating?
export const authenticateAsNewGuest = () => {
  return guestAuthenticationResource.request(
    {
      guestUser: null,
    },
    (data) => http.post('/api/auth/guest', data)
  );
};

// TODO: Does the name for this mae sense? is it authenticating?
export const authenticateAsExistentGuest = (
  req: Resources.Util.RequestOf<typeof guestAuthenticationResource>
) => {
  return guestAuthenticationResource.request(req, (data) => http.post('/api/auth/guest', data));
};

const {
  resource: connectExternalAccountResource,
} = Resources.Collections.User.ConnectExternalAccount;

export const connectExternalAccount = (
  req: Resources.Util.RequestOf<typeof connectExternalAccountResource>
) => {
  return connectExternalAccountResource.request(req, (data) => {
    return http.post(`api/users/connect-external-account`, data)

  }
  );
};
