import fs from 'fs';
import https from 'https';

/**
 * configure ssl client certificate for https.Agent
 * @param certfile path to certificate
 * @param passphrase certificate password
 * @returns configured certificate
 */
export function configureCert(certfile, passphrase) {
  const cert = certfile ? fs.readFileSync(certfile) : null;
  const certConfig = {
    cert,
    key: cert,
    passphrase
  };
  return certConfig;
}
/**
 * configure https.Agent using certificate and password
 * @param certfile path to certificate
 * @param passphrase certificate password
 * @returns configured certificate
 */
export function configureAgent(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);
  return configureAgentConfig(certConfig);
}
/**
 * configure https.Agent using certificate config
 * @param certConfig client certificate
 * @returns ssl-configured instance of https.Agent
 */
export function configureAgentConfig(certConfig) {
  const sslConfiguredAgent = new https.Agent(certConfig);
  return sslConfiguredAgent;
}

/**
 * configure global https.Agent using certificate and password
 * @param certfile path to certificate
 * @param passphrase certificate password
 * @returns configured certificate
 */
export function configureGlobalAgent(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);
  return configureGlobalAgentConfig(certConfig);
}

/**
 * configure global https.Agent using certificate config
 * @param certConfig client certificate
 */
export function configureGlobalAgentConfig(certConfig) {
  Object.assign(https.globalAgent.options, certConfig);
}
