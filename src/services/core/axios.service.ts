import axios, { AxiosRequestConfig } from 'axios';
const defaultConfig: AxiosRequestConfig = {
  headers: {
    accept: 'application/json',
    'Content-Type': 'application/json'
  }
};

class CustomRequest {
  config: AxiosRequestConfig;
  constructor(config = defaultConfig) {
    this.config = config;
  }

  get(url: string, config = this.config) {
    return axios.get(url, config);
  }

  post(url: string, data = {}, config = this.config) {
    return axios.post(url, data, config);
  }

  put(url: string, data = {}, config = this.config) {
    return axios.put(url, data, config);
  }

  patch(url: string, data = {}, config = this.config) {
    return axios.patch(url, data, config);
  }

  delete(url: string, config = this.config) {
    return axios.delete(url, config);
  }
}

const requestService = new CustomRequest();
export default requestService;
