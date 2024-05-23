export default class UriAccessor {
  /**
   * @param {string} uri
   */
  constructor(uri) {
    this.uri = uri;
  }

  /**
   * @returns {Promise<string>}
   * @throws {Error}
   */
  async getContent() {
    throw new Error(`${this.constructor.name}.getContent not implemented`);
  }

  /* eslint no-unused-vars: ["error", { "args": "none" }] -- Отключение правила "no-unused-vars" */
  /**
   * @param {string} content
   * @param {string} contentType
   * @returns {Promise<void>}
   * @throws {Error}
   */
  async setContent(content, contentType) {
    throw new Error(`${this.constructor.name}.setContent not implemented`);
  }

  /**
   * @returns {Promise<Buffer>}
   * @throws {Error}
   */
  async getBinary() {
    throw new Error(`${this.constructor.name}.getBinary not implemented`);
  }
}
