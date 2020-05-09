import axios, { AxiosRequestConfig } from 'axios';
import config from 'src/config';


export const getHttpInstance = (opts?: AxiosRequestConfig) => {
  const instance = axios.create(opts);

  const logUnimportantStyle = 'color: grey;';
  const logImportantStyle = 'font-weight: bold;';
  const logSuccessStyle = 'color: #4CAF50; font-weight: bold;';
  const logErrorStyle = 'color: red; font-weight: bold;';

  instance.interceptors.request.use((request) => {
  // const requestBody = (typeof request.data === 'string')
  //   ? tryToJSONParseOrReturn(options.body)
  //   : options.body;
    const requestBody = request.data;

    console.group(
      '%cHttp %cRequest:',
      logUnimportantStyle,
      logImportantStyle,
      request,
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
  });

  instance.interceptors.response.use(
    (response) => {
    // console.log('Http Response:', response);

      // const response = await localFetch(request, options);
      // const json = await response.json();

      // const responseOk = response.status >= 200 && response.status < 300;

      console.group(
        '%cHttp %cResponse %cSuccess:',
        logUnimportantStyle,
        logImportantStyle,
        logSuccessStyle,
        response,
      );

      console.log('Response: ', response);
      console.log('Body:     ', response.data);
      // console.log('Copy Body:', {
      //   stringified: JSON.stringify(json),
      // });
      console.groupEnd();

      // return new Ok(response);
      return response;
    },
    (e) => {
      console.group(
        '%cHttp %cResponse %cError:',
        logUnimportantStyle,
        logImportantStyle,
        logErrorStyle,
      );

      console.log('Error: ', e);
      console.groupEnd();

      return Promise.reject(e);
    },
  );

  return instance;
};

export const http = getHttpInstance({
  baseURL: config.HTTP_ENDPOINT,
});
