import UriAccessorFactory from '../src/UriAccessorFactory';
import UriAccessorHttp from '../src/UriAccessorHttp';
import finalhandler from 'finalhandler';
import http from 'http';
import serveStatic from 'serve-static';
import ProxyAgent from 'proxy-agent';
import { Agent as BetterHttpsProxyAgent } from 'better-https-proxy-agent';
import { configureAgent, configureCert, configureProxy } from '../src/agent';
import Timeout from 'await-timeout';
import { timeoutSignal } from '../src/control.js';

const serve = serveStatic('test/data', { index: ['index.html', 'index.htm'] });
const server = http.createServer(async function onRequest(req, res) {
  if (req.url == '/testcontentype') {
    res.write(req.headers['content-type'] || '!!undefined!!');
    res.end();
  }
  if (req.url == '/slowurl') {
    await Timeout.set(3000);
    res.write('OK');
    res.end();
  }

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
  // const uriAccessor = new UriAccessorHttp(uri);
  const uaf = new UriAccessorFactory({ currentUser: 'test', uriAccessorFileEnabled: false });
  const uriAccessor = uaf.getUriAccessor(uri);
  const content = await uriAccessor.getContent();
  expect(content).toStrictEqual(expectedStr);
});

test('getContentType', async () => {
  const uri = 'http://localhost:3030/testcontentype';
  const expectedStr = 'application/json';
  // const uriAccessor = new UriAccessorHttp(uri);
  const uaf = new UriAccessorFactory({ currentUser: 'test', uriAccessorFileEnabled: false });
  const uriAccessor = uaf.getUriAccessor(uri);
  const content = await uriAccessor.getContent({ headers: { 'content-type': 'application/json' } });
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

// console.log(node_fetch_with_proxy);
// example cmd: https_proxy=http://proxy:3128 no_proxy=gitlab.com npm run test

const ifproxyset = process.env.https_proxy ? describe : describe.skip;
ifproxyset('proxy test', () => {
  test('https_proxy env test', async () => {
    const uri = 'https://github.com/ilb/uriaccessorjs/raw/master/test/data/testfile.txt';
    const expectedStr = 'test content';
    const agent = new ProxyAgent();
    const uriAccessor = new UriAccessorHttp(uri, { agent });
    const content = await uriAccessor.getContent();
    expect(content).toStrictEqual(expectedStr);
  });

  test('no_proxy-env-test', async () => {
    const uri = 'https://gitlab.com/slavb18/uriaccessorjs/-/raw/master/test/data/testfile.txt';
    const expectedStr = 'test content';
    const agent = new ProxyAgent();
    const uriAccessor = new UriAccessorHttp(uri, { agent });
    const content = await uriAccessor.getContent();
    expect(content).toStrictEqual(expectedStr);
  });
});

//cmd: node --experimental-vm-modules node_modules/jest/bin/jest.js -t proxy-cert-test
const ifproxysetcert =
  process.env.https_proxy && process.env.certauthurl ? describe : describe.skip;
ifproxysetcert('proxy-cert-test', () => {
  test('certificate-with-proxy-test', async () => {
    const uri = process.env.certauthurl;
    const expectedStr = process.env.certauthexpected;
    // const agent0 = configureAgent(process.env.certfile, process.env.certpass);
    // console.log(agent0);
    const certConfig = configureCert(process.env.certfile, process.env.certpass);
    const proxyOptions = configureProxy(process.env.https_proxy);
    const agent = new BetterHttpsProxyAgent(certConfig, proxyOptions);
    const uriAccessor = new UriAccessorHttp(uri, { agent });
    const content = await uriAccessor.getContent();
    expect(content).toStrictEqual(expectedStr);
  });
});

const ifcert = process.env.certauthurl ? describe : describe.skip;
ifcert('cert-test', () => {
  test('certificate-test', async () => {
    const uri = process.env.certauthurl;
    const expectedStr = process.env.certauthexpected;
    const agent = configureAgent(process.env.certfile, process.env.certpass);
    const uriAccessor = new UriAccessorHttp(uri, { agent });
    const content = await uriAccessor.getContent();
    expect(content).toStrictEqual(expectedStr);
  });
});

// const ifslow = process.env.slowurl ? describe : describe.skip;
// ifslow('slow-test', () => {
test('slow-abort-test', async () => {
  const uri = 'http://localhost:3030/slowurl';

  const uriAccessor = new UriAccessorHttp(uri, { signal: timeoutSignal(1000) });
  await expect(uriAccessor.getContent()).rejects.toThrow('The user aborted a request.');
});
// });

//cmd: node --experimental-vm-modules --use-openssl-ca node_modules/jest/bin/jest.js -t system-cert-test
const ifsystemsetcert =
  process.env.https_proxy && process.env.systemcerturl ? describe : describe.skip;
ifsystemsetcert('system-cert-test', () => {
  test('system-cert-test-test', async () => {
    const uri = process.env.systemcerturl;
    // const agent0 = configureAgent(process.env.certfile, process.env.certpass);
    // console.log(agent0);
    const certConfig = configureCert(process.env.certfile, process.env.certpass);
    const proxyOptions = configureProxy(process.env.https_proxy);
    const agent = new BetterHttpsProxyAgent({}, { ...certConfig, ...proxyOptions });
    const uriAccessor = new UriAccessorHttp(uri, { agent });
    await expect(uriAccessor.getContent()).rejects.toThrow('Forbidden');
  });
});
