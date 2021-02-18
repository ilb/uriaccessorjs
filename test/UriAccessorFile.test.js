import UriAccessorFile from '../src/UriAccessorFile';
import path from 'path';
import url from 'url';
// import * as fs from 'fs';

const uri = url.pathToFileURL(path.resolve('test/testfile.txt')).toString();
// console.log({ uri });

const uriAccessor = new UriAccessorFile(uri);
const expectedStr = 'test content';
const expectedBuf = Buffer.from(expectedStr, 'utf8');

test('fetches file', async () => {
  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
  const binary = await uriAccessor.getBinary();
  expect(binary).toStrictEqual(expectedBuf);
});
