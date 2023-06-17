import UriAccessor from './UriAccessor.js';
import Timeout from 'await-timeout';
import fetch from 'cross-fetch';
// import { timeoutSignal } from './control.js';
import createDebug from 'debug';

const debug = createDebug('uriaccessorjs');

export function mergeOptions(options1 = {}, options2 = {}) {
  const options = { ...options1, ...options2 };
  options.headers = { ...options1.headers, ...options2.headers };
  return options;
}
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

export async function fetchResponse(uri, response, options = {}) {
  checkStatus(response);
  while (response.status === 202) {
    const [timestr, refurl] = response.headers.get('refresh').split(';');
    debug('fetchResponse: status = %o, time = %o, refurl = %o', response.status, timestr, refurl);
    // resolve relative url
    const refurlstr = new URL(refurl, uri).toString();
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
      if (!this.options.headers) {
        this.options.headers = {};
      }
      this.options.headers['X-Remote-User'] = this.options.currentUser;
      delete this.options.currentUser;
    }
    // FIX client bundles. use instead:
    /// signal: timeoutSignal(1000)
    // if (this.options.timeout) {
    //   this.options.signal = timeoutSignal(this.options.timeout);
    //   delete this.options.timeout;
    // }
  }
  async getResponse(options = {}) {
    if (!this.response) {
      debug('getResponse: uri = %o', this.uri);
      const reqoptions = mergeOptions(this.options, options);
      let response = await fetch(this.uri, reqoptions);
      this.response = await fetchResponse(this.uri, response, reqoptions);
      this.contentType = this.response.headers.get('content-type');
      // console.log('fetched ' + this.uri + ' content-type=' + this.contentType);
    }
    return this.response;
  }

  async getContent(options = {}) {
    const response = await this.getResponse(options);
    const result = await response.text();
    return result;
  }
  async getBinary(options = {}) {
    const response = await this.getResponse(options);
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
    // FIX client bundles
    // if (Buffer.isBuffer(content)) {
    if (content.length) {
      options.headers['Content-length'] = content.length;
    }
    checkStatus(await fetch(this.uri, options));
  }
}
