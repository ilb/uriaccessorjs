import UriAccessorFile from "../uriaccessor/UriAccessorFile";

const fs = require('fs');
const path = require('path');
const fileUri = path.resolve('uriaccessor/')

const uri = 'file://' + __dirname + '/testfile.txt';
// console.log(uri);

const uriAccessor = new UriAccessorFile(uri);
const expectedStr = "test content";
const expectedBuf = Buffer.from(expectedStr, 'utf8');

test('fetches file', async () => {
    expect(uriAccessor.getContent()).resolves.toStrictEqual(expectedStr);
    expect(uriAccessor.getBinary()).resolves.toStrictEqual(expectedBuf);

});

