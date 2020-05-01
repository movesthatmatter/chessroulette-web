import axios from 'axios';

const instance = axios.create();

instance.interceptors.request.use((request) => {
  console.log('Http Request', request);
  return request;
});

instance.interceptors.response.use((response) => {
  console.log('Http Response:', response);
  return response;
}, (e) => {
  console.warn('Http Response Error:', e);
  return e;
});

export const http = instance;
