import UriAccessorHttp from '../src/UriAccessorHttp';
import finalhandler from 'finalhandler';
import http from 'http';
import serveStatic from 'serve-static';

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

const uri = 'http://localhost:3030/testfile.txt';

const expectedStr = 'test content';
const expectedBuf = Buffer.from(expectedStr, 'utf8');

test('getContent', async () => {
  const uriAccessor = new UriAccessorHttp(uri);
  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
});

test('getBinary', async () => {
  const uriAccessor = new UriAccessorHttp(uri);
  const binary = await uriAccessor.getBinary();
  expect(binary).toStrictEqual(expectedBuf);
});
