import fs from "fs";
import https from "https";

/**
 * configure ssl client certificate for https.Agent
 * @param {string} certfile path to certificate
 * @param {string} passphrase certificate password
 * @returns {Object} configured certificate
 */
export function configureCert(certfile, passphrase) {
  const cert = certfile ? fs.readFileSync(certfile) : null;
  const certConfig = {
    cert,
    key: cert,
    passphrase,
  };

  return certConfig;
}

/**
 * configure https.Agent using certificate config
 * @param {Object} certConfig client certificate
 * @returns {https.Agent} ssl-configured instance of https.Agent
 */
export function configureAgentConfig(certConfig) {
  const sslConfiguredAgent = new https.Agent(certConfig);

  return sslConfiguredAgent;
}

/**
 * configure global https.Agent using certificate config
 * @param {Object} certConfig client certificate
 * @returns {null}
 */
export function configureGlobalAgentConfig(certConfig) {
  Object.assign(https.globalAgent.options, certConfig);

  return null;
}

/**
 * configure https.Agent using certificate and password
 * @param {string} certfile path to certificate
 * @param {string} passphrase certificate password
 * @returns {Object} configured certificate
 */
export function configureAgent(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);

  return configureAgentConfig(certConfig);
}

/**
 * configure global https.Agent using certificate and password
 * @param {string} certfile path to certificate
 * @param {string} passphrase certificate password
 * @returns {Object} configured certificate
 */
export function configureGlobalAgent(certfile, passphrase) {
  const certConfig = configureCert(certfile, passphrase);

  return configureGlobalAgentConfig(certConfig);
}

/**
 * @param {string} proxyUrl
 * @returns {Object} proxy configuration
 */
export function configureProxy(proxyUrl) {
  let configuredProxy = proxyUrl;

  if (typeof configuredProxy === "string") {
    configuredProxy = new URL(configuredProxy);
  }
  const proxyConfig = {
    protocol: configuredProxy.protocol,
    host: configuredProxy.hostname || configuredProxy.host,
    port: configuredProxy.port,
  };

  return proxyConfig;
}
