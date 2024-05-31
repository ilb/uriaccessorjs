import Url from "url";

/**
 * transform various uri types to string
 * @param {any} uri
 * @returns {string}
 */
export function uriToString(uri) {
  switch (uri.constructor?.name) {
    case "URL":
      return uri.toString();
    case "Url":
      return Url.format(uri);
    case "String":
      return uri;
    default:
      return uri.toString();
  }
}
