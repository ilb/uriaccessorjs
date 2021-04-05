import UriAccessor from './UriAccessor.js';
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
  constructor(uri, currentUser) {
    super(uri);
    this.currentUser = currentUser;
  }
  async getResponse() {
    if (!this.response) {
      const options = {};
      if (this.currentUser) {
        options.headers = {};
        options.headers['X-Remote-User'] = this.currentUser;
      }
      this.response = checkStatus(await fetch(this.uri, options));
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
    if (this.currentUser) {
      options.headers['X-Remote-User'] = this.currentUser;
    }
    checkStatus(await fetch(this.uri, options));
  }
}
