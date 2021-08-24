import UriAccessorFile from './UriAccessorFile.js';
import UriAccessorHttp from './UriAccessorHttp.js';
import url from 'url';

export default class UriAccessorFactory {
  /**
   *
   * @param {fetch} use to override fetch, e.g. from fetch-with-proxy
   */
  constructor({ currentUser, uriAccessorFileEnabled, fetch }) {
    this.currentUser = currentUser;
    this.uriAccessorFileEnabled = uriAccessorFileEnabled;
    this.fetch = fetch;
  }

  getUriAccessor(uri) {
    const parts = url.parse(uri);
    switch (parts.protocol) {
      case 'file:':
        if (!this.uriAccessorFileEnabled) {
          throw new Error('UriAccessorFile not enabled');
        }
        return new UriAccessorFile(uri);
      case 'http:':
      case 'https:':
        return new UriAccessorHttp(uri, this.currentUser, fetch);
      default:
        throw new Error(parts.protocol + ' not implemented');
    }
  }
}
