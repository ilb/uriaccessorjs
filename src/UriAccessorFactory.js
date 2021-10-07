import UriAccessorFile from './UriAccessorFile.js';
import UriAccessorHttp from './UriAccessorHttp.js';
import UriAgentFactory from './UriAgentFactory.js';

export default class UriAccessorFactory {
  /**
   *
   * @param {fetch} use to override fetch, e.g. from fetch-with-proxy
   */
  constructor({ currentUser, uriAccessorFileEnabled, uriAgentFactory }) {
    this.currentUser = currentUser;
    this.uriAccessorFileEnabled = uriAccessorFileEnabled;
    this.uriAgentFactory = uriAgentFactory || new UriAgentFactory({});
  }

  getUriAccessor(uri) {
    const url = new URL(uri);
    switch (url.protocol) {
      case 'file:':
        return this.getUriAccessorFile(uri);
      case 'http:':
      case 'https:':
        return this.getUriAccessorHttp(uri);
      default:
        throw new Error(url.protocol + ' not implemented');
    }
  }
  getUriAccessorFile(uri) {
    if (!this.uriAccessorFileEnabled) {
      throw new Error('UriAccessorFile not enabled');
    }
    return new UriAccessorFile(uri);
  }
  getUriAccessorHttp(uri) {
    return new UriAccessorHttp(uri, {
      currentUser: this.currentUser,
      agent: (_uri) => this.uriAgentFactory.getAgent(_uri)
    });
  }
}
