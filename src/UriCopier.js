export default class UriCopier {
  /**
   * @param {Object} root0
   * @param {UriAccessorFactory} root0.uriAccessorFactory
   */
  constructor({ uriAccessorFactory }) {
    this.uriAccessorFactory = uriAccessorFactory;
  }

  /**
   * @param {string} fromUri
   * @param {string} toUri
   * @returns {Promise<void>}
   */
  async copyUrl(fromUri, toUri) {
    // GET
    const fromAccessor = this.uriAccessorFactory.getUriAccessor(fromUri);
    const content = await fromAccessor.getBinary();
    const contentType = fromAccessor.getContentType();

    // PUT
    const toAccessor = this.uriAccessorFactory.getUriAccessor(toUri);

    await toAccessor.setContent(content, contentType);
  }
}
