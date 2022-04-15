/**
 * transform various uri types to string
 * @param {*} uri
 */
function uriToString(uri) {
  // console.log(
  //   uri,
  //   `toString=${uri.toString()}, type='${typeof uri}', class='${uri.constructor?.name}'`
  // );
  switch (uri.constructor?.name) {
    case 'URL':
      return uri.toString();
    case 'Url':
      return uri.href;
    default:
      return uri.toString();
  }
}
/**
 * Match uri by String (startsWith) or RegExp (match) key
 * @param {String | RegExp} key matcher
 * @param {String | URL} uri address to test
 * @returns
 */
function matchUri(key, uri) {
  if (key instanceof RegExp) {
    return uriToString(uri).match(key);
  } else {
    return uriToString(uri).startsWith(key);
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
