import { AbortController } from "node-abort-controller";
/**
 * @param {number} timeoutms
 * @returns {AbortSignal}
 */
export function timeoutSignal(timeoutms) {
  const controller = new AbortController();
  const signal = controller.signal;

  setTimeout(() => {
    controller.abort();
  }, timeoutms);
  return signal;
}
