import { uriToString } from "./uri.js";

/**
 * Match uri by String (startsWith) or RegExp (match) key
 * @param {string | RegExp} key matcher
 * @param {string | URL} uri address to test
 * @returns {boolean}
 */
function matchUri(key, uri) {
  if (key instanceof RegExp) {
    return uriToString(uri).match(key);
  }
  return uriToString(uri).startsWith(key);

}

export default class UriAgentFactory {
  /**
   * @param {Object} root0
   * @param {Object} root0.uriAgentMap
   */
  constructor({ uriAgentMap }) {
    this.map = uriAgentMap || null;
  }

  /**
   * @param {string} uri
   * @returns {https.Agent}
   */
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
