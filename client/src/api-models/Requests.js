import axios from 'axios';
import urls from '../urls';

const Request = function Request(headerConfigs) {
  const url = urls[urls.active];
  const baseInstance = axios.create({
    baseURL: `${url}api`,
    timeout: 10000,
  });
  baseInstance.interceptors.request.use((config) => {
    config.headers = {
      ...config.headers,
      ...headerConfigs,
    };
    return config;
  });
  return baseInstance;
};

export default Request;
