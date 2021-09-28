import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import config from 'src/config';
import { authenticationService } from 'src/services/Authentication';

export const getHttpInstance = (opts?: AxiosRequestConfig) => {
  const instance = axios.create(opts);

  const logUnimportantStyle = 'color: grey;';
  const logImportantStyle = 'font-weight: bold;';
  const logSuccessStyle = 'color: #4CAF50; font-weight: bold;';
  const logErrorStyle = 'color: red; font-weight: bold;';

  const requestInterceptor = (request: AxiosRequestConfig) => {
    const requestBody = request.data;

    console.group(
      `%cHttp.${request.method?.toUpperCase()} %cRequest:`,
      logUnimportantStyle,
      logImportantStyle,
      request.url
    );
    console.log('Options:    ', {
      ...request.params,
      body: requestBody,
      method: request.method,
    });
    console.log('Body:       ', requestBody);
    console.log('Copy Body:  ', {
      stringified: JSON.stringify(requestBody),
    });
    console.groupEnd();

    return request;
  };

  const responseInterceptor = (response: AxiosResponse) => {
    console.group(
      '%cHttp %cResponse %cSuccess:',
      logUnimportantStyle,
      logImportantStyle,
      logSuccessStyle,
      response.config.url
    );

    console.log('Response: ', response);
    console.log('Body:     ', response.data);
    // console.log('Copy Body:', {
    //   stringified: JSON.stringify(json),
    // });
    console.groupEnd();

    // return new Ok(response);
    return response;
  };

  if (config.DEBUG) {
    instance.interceptors.request.use(requestInterceptor);

    instance.interceptors.response.use(responseInterceptor, (e) => {
      console.group(
        '%cHttp %cResponse %cError:',
        logUnimportantStyle,
        logImportantStyle,
        logErrorStyle
      );

      console.log('Error: ', e);
      console.groupEnd();

      return Promise.reject(e);
    });
  }

  // Add the Authentication Header
  instance.interceptors.request.use(async (request) => {
    const accessTokenResult = await authenticationService.get().resolve();

    if (accessTokenResult.ok) {
      request.headers = {
        ...request.headers,
        Authorization: `Bearer ${
          accessTokenResult.val.isGuest
            ? accessTokenResult.val.id
            : accessTokenResult.val.accessToken
        }`,
      };
    }

    return request;
  });

  instance.interceptors.response.use(undefined, (e) => {
    if (e instanceof Error) {
      // This isn't the best way to check the error, but it works for now!
      // Anytime the server returns a 401 it means the Authenticated User isn't correct
      //  so just deauthenticate it!
      // A better approach would be to get the payload from the server and check against it!
      if (e.message === 'Request failed with status code 401') {
        authenticationService.remove();
      }
    }

    return Promise.reject(e);
  });

  return instance;
};

export const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
});
