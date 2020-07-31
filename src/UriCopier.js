export default class UriCopier  {
    constructor({uriAccessorFactory}) {
        this.uriAccessorFactory = uriAccessorFactory;
    }

    async copyUrl(fromUri,toUri) {
        //GET
        const fromAccessor = this.uriAccessorFactory.getUriAccessor(fromUri);
        const content = await fromAccessor.getBinary();
        const contentType = fromAccessor.getContentType();

        //PUT
        const toAccessor = this.uriAccessorFactory.getUriAccessor(toUri);
        await toAccessor.setContent(content, contentType);
    }
}
