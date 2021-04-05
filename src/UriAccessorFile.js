import UriAccessor from './UriAccessor.js';
import fs from 'fs';

export default class UriAccessorFile extends UriAccessor {
  getPath() {
    return this.uri.substring(7);
  }
  getBuffer() {
    return fs.readFileSync(this.getPath());
  }

  async getContent() {
    return Promise.resolve(this.getBuffer().toString());
  }
  async getBinary() {
    return Promise.resolve(this.getBuffer());
  }
}
