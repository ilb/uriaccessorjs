import UriAccessor from './UriAccessor.js';
import Timeout from 'await-timeout';
import fetch from 'isomorphic-fetch';
import { timeoutSignal } from './control.js';

export function checkStatus(response) {
  //check status
  if (!response.ok) {
    const logMsg = response.status + ': ' + response.statusText + ' url: ' + response.url;
    // log response to console
    response.text().then((content) => console.log(logMsg + '\n' + content));
    var error = new Error(logMsg);
    error.response = response;
    throw error;
  }
  return response;
}

export async function fetchResponse(response, options) {
  checkStatus(response);
  while (response.status === 202) {
    const [timestr, refurl] = response.headers.get('refresh').split(';');
    // resolve relative url
    const refurlstr = new URL(refurl, this.uri).toString();
    const timeout = timestr && Number(timestr) ? Number(timestr) : 1;
    await Timeout.set(timeout * 1000);
    response = await fetch(refurlstr, options);
    checkStatus(response);
  }
  return response;
}

export default class UriAccessorHttp extends UriAccessor {
  constructor(uri, options = {}) {
    super(uri);
    this.options = Object.assign({}, options);
    if (this.options.currentUser) {
      this.options.headers = {};
      this.options.headers['X-Remote-User'] = this.options.currentUser;
      delete this.options.currentUser;
    }
    if (this.options.timeout) {
      this.options.signal = timeoutSignal(this.options.timeout);
      delete this.options.timeout;
    }
  }
  async getResponse() {
    if (!this.response) {
      let response = await fetch(this.uri, this.options);
      this.response = await fetchResponse(response, this.options);
      this.contentType = this.response.headers.get('content-type');
      // console.log('fetched ' + this.uri + ' content-type=' + this.contentType);
    }
    return this.response;
  }

  async getContent() {
    const response = await this.getResponse();
    const result = await response.text();
    return result;
  }
  async getBinary() {
    const response = await this.getResponse();
    const result = await response.buffer();
    return result;
  }

  checkBuild() {
    if (!this.response) {
      throw new Error('data not fetched');
    }
  }
  getContentType() {
    this.checkBuild();
    return this.contentType;
  }

  async setContent(content, contentType) {
    const options = {
      ...this.options,
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: content
    };
    if (Buffer.isBuffer(content)) {
      options.headers['Content-length'] = content.length;
    }
    checkStatus(await fetch(this.uri, options));
  }
}
