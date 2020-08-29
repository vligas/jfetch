import { defaultsDeep } from 'lodash';
import { ApiError } from './errors';

export const defaultOptions = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export class JsonFetch {
  constructor(options = {}) {
    this.defaultOptions = defaultsDeep({}, options, defaultOptions);
  }

  static async checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const err = new ApiError(response.statusText);
    return response.json().then(obj => {
      err.response = response.json();
      err.body = obj;
      throw err;
    });
  }

  static parseJSON(response) {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
  }

  get(url, options) {
    return fetch(url, {
      ...defaultsDeep({ method: 'GET' }, options, this.defaultOptions),
    })
      .then(JsonFetch.checkStatus)
      .then(JsonFetch.parseJSON);
  }

  post(url, options) {
    return fetch(url, {
      ...defaultsDeep({ method: 'POST' }, options, this.defaultOptions),
    })
      .then(JsonFetch.checkStatus)
      .then(JsonFetch.parseJSON);
  }

  put(url, options) {
    return fetch(url, {
      ...defaultsDeep({ method: 'PUT' }, options, this.defaultOptions),
    })
      .then(JsonFetch.checkStatus)
      .then(JsonFetch.parseJSON);
  }

  del(url, options) {
    return fetch(url, {
      ...defaultsDeep({ method: 'DELETE' }, options, this.defaultOptions),
    })
      .then(JsonFetch.checkStatus)
      .then(JsonFetch.parseJSON);
  }

  delete(...params) {
    return this.del(...params);
  }
}
