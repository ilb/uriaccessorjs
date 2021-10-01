export default class UriAgentFactory {
  constructor({ uriAgentMap }) {
    this.map = uriAgentMap || null;
  }
  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  getAgent(uri) {
    if (this.map) {
      for (const [key, value] of this.map.entries()) {
        if (uri.match(key)) {
          return value;
        }
      }
    }
    return null;
  }
}
