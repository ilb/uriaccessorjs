import UriAccessorHttp from '../src/UriAccessorHttp';
import finalhandler from 'finalhandler';
import http from 'http';
import serveStatic from 'serve-static';
import * as node_fetch_with_proxy from 'node-fetch-with-proxy';

const serve = serveStatic('test/data', { index: ['index.html', 'index.htm'] });
const server = http.createServer(function onRequest(req, res) {
  serve(req, res, finalhandler(req, res));
});

beforeAll(async () => {
  server.listen(3030);
});

afterAll(async () => {
  server.close();
});

test('getContent', async () => {
  const uri = 'http://localhost:3030/testfile.txt';
  const expectedStr = 'test content';
  const uriAccessor = new UriAccessorHttp(uri);
  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
});

test('getBinary', async () => {
  const uri = 'http://localhost:3030/testfile.txt';
  const expectedStr = 'test content';
  const expectedBuf = Buffer.from(expectedStr, 'utf8');

  const uriAccessor = new UriAccessorHttp(uri);
  const binary = await uriAccessor.getBinary();
  expect(binary).toStrictEqual(expectedBuf);
});

const maybe = process.env.https_proxy ? describe : describe.skip;
maybe('proxy test', () => {
  test('node-fetch-with-proxy test', async () => {
    const uri = 'https://github.com/ilb/uriaccessorjs/raw/master/test/data/testfile.txt';
    const expectedStr = 'test content';

    const uriAccessor = new UriAccessorHttp(uri, null, node_fetch_with_proxy);
    const content = await uriAccessor.getContent();
    expect(content).toStrictEqual(expectedStr);
  });
});
