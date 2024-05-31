import fs from "fs";

import UriAccessor from "./UriAccessor.js";

export default class UriAccessorFile extends UriAccessor {
  /**
   * @returns {string}
   */
  getPath() {
    return this.uri.slice(7).split("?")[0];
  }
  /**
   * @returns {Buffer}
   */
  getBuffer() {
    return fs.readFileSync(this.getPath());
  }

  /**
   * @returns {Promise<string>}
   */
  async getContent() {
    return Promise.resolve(this.getBuffer().toString());
  }
  /**
   * @returns {Promise<Buffer>}
   */
  async getBinary() {
    return Promise.resolve(this.getBuffer());
  }
}
