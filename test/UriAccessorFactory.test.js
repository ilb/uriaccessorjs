import UriAccessorFactory from '../src/UriAccessorFactory';
import path from 'path';
import url from 'url';

test('get UriAccessorFile', async () => {
  const uaf = new UriAccessorFactory({ currentUser: 'test', uriAccessorFileEnabled: true });
  const uri = url.pathToFileURL(path.resolve('test/data/testfile.txt')).toString();
  // console.log({ uri });
  const uriAccessor = uaf.getUriAccessor(uri);
  expect(uriAccessor.constructor.name).toStrictEqual('UriAccessorFile');
});

test('fail UriAccessorFile', async () => {
  const uaf = new UriAccessorFactory({ currentUser: 'test', uriAccessorFileEnabled: false });
  const uri = url.pathToFileURL(path.resolve('test/data/testfile.txt')).toString();
  // console.log({ uri });
  expect(() => uaf.getUriAccessor(uri)).toThrowError(/UriAccessorFile not enabled/);
});

test('get UriAccessorHttp', async () => {
  const uaf = new UriAccessorFactory({ currentUser: 'test', uriAccessorFileEnabled: false });
  const uri = 'http://localhost:3030/testfile.txt';
  const uriAccessor = uaf.getUriAccessor(uri);
  expect(uriAccessor.constructor.name).toStrictEqual('UriAccessorHttp');
});
