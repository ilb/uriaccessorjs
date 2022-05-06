import UriAccessorFile from '../src/UriAccessorFile';
import path from 'path';
import url from 'url';

const uri = url.pathToFileURL(path.resolve('test/data/testfile.txt')).toString();
// console.log({ uri });

const expectedStr = 'test content';
const expectedBuf = Buffer.from(expectedStr, 'utf8');

test('getContent', async () => {
  const uriAccessor = new UriAccessorFile(uri);

  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
});

test('getBinary', async () => {
  const uriAccessor = new UriAccessorFile(uri);

  const binary = await uriAccessor.getBinary();
  expect(binary).toStrictEqual(expectedBuf);
});

test('getContentQuery', async () => {
  const uriAccessor = new UriAccessorFile(uri + '?someparam=value');

  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
});
