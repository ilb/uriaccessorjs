/**
 * Match uri by String (startsWith) or RegExp (match) key
 * @param {String | RegExp} key
 * @param {String} uri
 * @returns
 */
function matchUri(key, uri) {
  if (key instanceof RegExp) {
    return uri.match(key);
  } else {
    return uri.startsWith(key);
  }
}

export default class UriAgentFactory {
  constructor({ uriAgentMap }) {
    this.map = uriAgentMap || null;
  }

  /*eslint no-unused-vars: ["error", { "args": "none" }]*/
  getAgent(uri) {
    if (this.map) {
      for (const [key, value] of this.map.entries()) {
        if (matchUri(key, uri)) {
          return value;
        }
      }
    }
    return null;
  }
}
