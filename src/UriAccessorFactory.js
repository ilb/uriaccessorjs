import UriAccessorFile from './UriAccessorFile';
import UriAccessorHttp from './UriAccessorHttp';
import url from 'url';

export default class UriAccessorFactory {
  constructor({ currentUser, uriAccessorFileEnabled }) {
    this.currentUser = currentUser;
    this.uriAccessorFileEnabled = uriAccessorFileEnabled;
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
        return new UriAccessorHttp(uri, this.currentUser);
      default:
        throw new Error(parts.protocol + ' not implemented');
    }
  }
}
