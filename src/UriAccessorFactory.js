import UriAccessorFile from './UriAccessorFile.js';
import UriAccessorHttp from './UriAccessorHttp.js';
import UriAgentFactory from './UriAgentFactory.js';
import url from 'url';

export default class UriAccessorFactory {
  /**
   *
   * @param {fetch} use to override fetch, e.g. from fetch-with-proxy
   */
  constructor({ currentUser, uriAccessorFileEnabled, uriAgentFactory, fetch }) {
    this.currentUser = currentUser;
    this.uriAccessorFileEnabled = uriAccessorFileEnabled;
    this.uriAgentFactory = uriAgentFactory || new UriAgentFactory();
    this.fetch = fetch;
  }

  getUriAccessor(uri) {
    const parts = url.parse(uri);
    switch (parts.protocol) {
      case 'file:':
        return this.getUriAccessorFile(uri);
      case 'http:':
      case 'https:':
        return this.getUriAccessorHttp(uri);
      default:
        throw new Error(parts.protocol + ' not implemented');
    }
  }
  getUriAccessorFile(uri) {
    if (!this.uriAccessorFileEnabled) {
      throw new Error('UriAccessorFile not enabled');
    }
    return new UriAccessorFile(uri);
  }
  getUriAccessorHttp(uri) {
    const agent = this.uriAgentFactory.getAgent(uri);
    return new UriAccessorHttp(uri, {
      currentUser: this.currentUser,
      agent: agent,
      fetch: this.fetch
    });
  }
}
