export default class UriAccessor {
  constructor(uri) {
    this.uri = uri;
  }

  async getContent() {
    throw new Error(this.constructor.name + '.getContent not implemented');
  }

  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  async setContent(content, contentType) {
    throw new Error(this.constructor.name + '.setContent not implemented');
  }

  async getBinary() {
    throw new Error(this.constructor.name + '.getBinary not implemented');
  }
}
