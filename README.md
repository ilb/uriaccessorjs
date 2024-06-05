# uriaccessorjs

uriaccessor for javascript

## usage

inject using awilix
```
    constructor({uriAccessorFactory}) {
        this.uriAccessorFactory = uriAccessorFactory;
    }
```

or simply create new instance using `new UriAccessorFactory({currentUser})`

then get uri accessor and use its method

```
const uriAccessor = this.uriAccessorFactory.getUriAccessor(uri);
const buffer = await uriAccessor.getBinary();
const string = await uriAccessor.getContent();



```

etc
