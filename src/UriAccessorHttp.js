import UriAccessor from './UriAccessor.js';
import Timeout from 'await-timeout';
import fetch from 'isomorphic-fetch';

export function checkStatus(response) {
  //check status
  if (response.status < 200 || response.status >= 400) {
    const logMsg = response.status + ': ' + response.statusText + ' url: ' + response.url;
    // log response to console
    response.text().then((content) => console.log(logMsg + '\n' + content));
    var error = new Error(logMsg);
    error.response = response;
    throw error;
  }
  return response;
}

export default class UriAccessorHttp extends UriAccessor {
  constructor(uri, options = {}) {
    super(uri);
    this.currentUser = options.currentUser || null;
    this.agent = options.agent || null;
  }
  configureOptions(options = {}) {
    if (this.agent) {
      options.agent = this.agent;
    }
    if (this.currentUser) {
      options.headers = {};
      options.headers['X-Remote-User'] = this.currentUser;
    }
    return options;
  }
  async getResponse() {
    if (!this.response) {
      const options = {};
      this.configureOptions(options);

      let response = checkStatus(await fetch(this.uri, options));
      while (response.status === 202) {
        const [timestr, refurl] = response.headers.get('refresh').split(';');
        // resolve relative url
        const refurlstr = new URL(refurl, this.uri).toString();
        const timeout = timestr && Number(timestr) ? Number(timestr) : 1;
        await Timeout.set(timeout * 1000);
        response = checkStatus(await fetch(refurlstr, options));
      }
      this.response = response;

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
      method: 'PUT',
      headers: {
        'Content-Type': contentType
      },
      body: content
    };
    if (Buffer.isBuffer(content)) {
      options.headers['Content-length'] = content.length;
    }
    this.configureOptions(options);
    checkStatus(await fetch(this.uri, options));
  }
}
