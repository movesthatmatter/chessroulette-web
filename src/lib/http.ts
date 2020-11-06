import axios, {
  AxiosRequestConfig,
  AxiosInterceptorManager,
  AxiosResponse,
} from 'axios';
import config from 'src/config';

export const getHttpInstance = (opts?: AxiosRequestConfig) => {
  const instance = axios.create(opts);

  const logUnimportantStyle = 'color: grey;';
  const logImportantStyle = 'font-weight: bold;';
  const logSuccessStyle = 'color: #4CAF50; font-weight: bold;';
  const logErrorStyle = 'color: red; font-weight: bold;';

  const requestInterceptor = (request: AxiosRequestConfig) => {
    const requestBody = request.data;

    console.group(
      '%cHttp %cRequest:',
      logUnimportantStyle,
      logImportantStyle,
      request.url
    );
    console.log('Options:    ', {
      ...request.params,
      body: requestBody,
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

  return instance;
};

export const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
});
