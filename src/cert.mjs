import fs from 'fs';
import https from 'https';

export function configureCert(certfile, passphrase) {
  const cert = certfile ? fs.readFileSync(certfile) : null;
  const certConfig = {
    cert,
    key: cert,
    passphrase
  };
  return certConfig;
}
export function configureAgent(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);

  const sslConfiguredAgent = new https.Agent(certConfig);
  return sslConfiguredAgent;
}

export function configureGlobalCert(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);
  //configure global https agent for node-fetch
  Object.assign(https.globalAgent.options, certConfig);
  return certConfig;
}
