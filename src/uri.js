import Url from 'url';

/**
 * transform various uri types to string
 * @param {*} uri
 */
export function uriToString(uri) {
  // console.log(
  //   uri,
  //   `toString=${uri.toString()}, type='${typeof uri}', class='${uri.constructor?.name}'`
  // );
  switch (uri.constructor?.name) {
    case 'URL':
      return uri.toString();
    case 'Url':
      return Url.format(uri);
    case 'String':
      return uri;
    default:
      return uri.toString();
  }
}
