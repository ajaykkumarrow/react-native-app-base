import config from '../config';
import storage from '../helpers/AsyncStorage';

let protocol;

if (config.environment === 'development') {
  protocol = null;
} else {
  protocol = 'http://';
}

const hostUrl = `${protocol + config.apiHost}:${config.apiPort}${config.apiBase}`;

const methods = ['get', 'post', 'put', 'delete', 'patch'];

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export default class APICLIENT {
  constructor() {
    methods.forEach(method => {
      this[method] = async (path, data, headerConfig) => {
        headerConfig = headerConfig === undefined ? await this.setAuthToken() : headerConfig;
        return new Promise((resolve, reject) => {
          fetch(hostUrl + path, {
            method,
            body: JSON.stringify(data),
            headers: headerConfig
          }).then(res => {
            resolve(res);
          }).catch(error => {
            reject(error);
          });
        });
      };
    });
  }

  setAuthToken = async token => {
    if (token) {
      headers.Authorization = token;
    } else {
      await storage.getItem('currentUser').then(response => {
        if (response && (Object.keys(response).length > 0) && response.token !== undefined) {
          headers.Authorization = response.token;
        }
      }, () => {});
      return headers;
    }
  }
}
