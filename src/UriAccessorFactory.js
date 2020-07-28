import UriAccessorFile from './UriAccessorFile';
import UriAccessorHttp from './UriAccessorHttp';

const urlapi = require('url');

export default class UriAccessorFactory {

    constructor({currentUser}) {
        this.currentUser = currentUser;
    }

    getUriAccessor(uri) {
        const parts = urlapi.parse(uri);
        switch (parts.protocol) {
            case "file:":
                return new UriAccessorFile(uri);
            case "http:":
            case "https:":
                return new UriAccessorHttp(uri, this.currentUser);
            default: 
                throw new Error(parts.protocol + " not implemented");
        }

    }
}