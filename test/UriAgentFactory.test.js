import UriAgentFactory from '../src/UriAgentFactory';
import { configureAgent } from '../src/agentutils';

test('getAgent_RegExp', async () => {
  const uriAgentMap = new Map();
  uriAgentMap.set(/https:\/\/www.google.com.*/, configureAgent('test/data/cert.pem', 'ajuij2Ec'));
  const uaf = new UriAgentFactory({ uriAgentMap });
  const agent = uaf.getAgent('https://www.google.com');
  expect(agent.options.passphrase).toStrictEqual('ajuij2Ec');
  const agent2 = uaf.getAgent('https://google.com');
  expect(agent2).toStrictEqual(null);
});

test('getAgent_String', async () => {
  const uriAgentMap = new Map();
  uriAgentMap.set('https://www.google.com', configureAgent('test/data/cert.pem', 'ajuij2Ec'));
  const uaf = new UriAgentFactory({ uriAgentMap });
  const agent = uaf.getAgent('https://www.google.com');
  expect(agent.options.passphrase).toStrictEqual('ajuij2Ec');
  const agent2 = uaf.getAgent('https://google.com');
  expect(agent2).toStrictEqual(null);
});
