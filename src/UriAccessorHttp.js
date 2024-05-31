import Timeout from "await-timeout";
import fetch from "cross-fetch";
import createDebug from "debug";

import UriAccessor from "./UriAccessor.js";

const debug = createDebug("uriaccessorjs");

/**
 * @param {Object} options1
 * @param {Object} options2
 * @returns {Object}
 */
export function mergeOptions(options1 = {}, options2 = {}) {
  const options = { ...options1, ...options2 };

  options.headers = { ...options1.headers, ...options2.headers };
  return options;
}
/**
 * @param {Response} response
 * @returns {Response}
 * @throws {Error}
 */
export function checkStatus(response) {
  // check status
  if (!response.ok) {
    const logMsg = `${response.status}: ${response.statusText} url: ${response.url}`;

    // log response to console
    // eslint-disable-next-line no-restricted-syntax -- Отключение правила "no-restricted-syntax"
    response.text().then(content => console.log(`${logMsg}\n${content}`));
    const error = new Error(logMsg);

    error.response = response;
    throw error;
  }
  return response;
}

/**
 * @param {string} uri
 * @param {Response} response
 * @param {Object} options
 * @returns {Promise<Response>}
 */
export async function fetchResponse(uri, response, options = {}) {
  let fetchedResponse = response;

  checkStatus(fetchedResponse);
  while (fetchedResponse.status === 202) {
    const [timestr, refurl] = fetchedResponse.headers.get("refresh").split(";");

    debug("fetchResponse: status = %o, time = %o, refurl = %o", fetchedResponse.status, timestr, refurl);
    // resolve relative url
    const refurlstr = new URL(refurl, uri).toString();
    const timeout = timestr && Number(timestr) ? Number(timestr) : 1;

    await Timeout.set(timeout * 1000);
    fetchedResponse = await fetch(refurlstr, options);
    checkStatus(fetchedResponse);
  }
  return fetchedResponse;
}

export default class UriAccessorHttp extends UriAccessor {
  /**
   * @param {string} uri
   * @param {Object} options
   * @returns {UriAccessorHttp}
   */
  constructor(uri, options = {}) {
    super(uri);
    this.options = Object.assign({}, options);
    if (this.options.currentUser) {
      if (!this.options.headers) {
        this.options.headers = {};
      }
      this.options.headers["X-Remote-User"] = this.options.currentUser;
      delete this.options.currentUser;
    }
    // FIX client bundles. use instead:
    // / signal: timeoutSignal(1000)
    // if (this.options.timeout) {
    //   this.options.signal = timeoutSignal(this.options.timeout);
    //   delete this.options.timeout;
    // }
  }
  /**
   * @param {Object} options
   * @returns {Promise<Response>}
   */
  async getResponse(options = {}) {
    if (!this.response) {
      debug("getResponse: uri = %o", this.uri);
      const reqoptions = mergeOptions(this.options, options);
      const response = await fetch(this.uri, reqoptions);

      this.response = await fetchResponse(this.uri, response, reqoptions);
      this.contentType = this.response.headers.get("content-type");
    }
    return this.response;
  }

  /**
   * @param {Object} options
   * @returns {Promise<string>}
   */
  async getContent(options = {}) {
    const response = await this.getResponse(options);
    const result = await response.text();

    return result;
  }
  /**
   * @param {Object} options
   * @returns {Promise<Buffer>}
   */
  async getBinary(options = {}) {
    const response = await this.getResponse(options);
    const result = await response.buffer();

    return result;
  }

  /**
   * @returns {void}
   * @throws {Error}
   */
  checkBuild() {
    if (!this.response) {
      throw new Error("data not fetched");
    }
  }
  /**
   * @returns {string}
   */
  getContentType() {
    this.checkBuild();
    return this.contentType;
  }

  /**
   * @param {string} content
   * @param {string} contentType
   * @returns {Promise<void>}
   */
  async setContent(content, contentType) {
    const options = {
      ...this.options,
      method: "PUT",
      headers: {
        "Content-Type": contentType,
      },
      body: content,
    };

    // FIX client bundles
    // if (Buffer.isBuffer(content)) {
    if (content.length) {
      options.headers["Content-length"] = content.length;
    }
    checkStatus(await fetch(this.uri, options));
  }
}
