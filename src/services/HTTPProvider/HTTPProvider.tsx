import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

type prop = {
  baseURL: string;
  data: AxiosRequestConfig;
}

class HTTPProvider {
  constructor() {
    this.initializeAxios(){};
  }  
  requestNewGameToken() {
    axios.post(prop.baseURL, prop.data)
    .then((response: AxiosResponse) => console.log('YES WE GOT DATA', response.data))
    .catch((err: AxiosError) => console.log('DAMN, WE GOT ERROR', err));
  }
}
export default HTTPProvider;
