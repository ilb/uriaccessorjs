import { AbortController } from 'node-abort-controller';
export function timeoutSignal(timeoutms) {
  const controller = new AbortController();
  const signal = controller.signal;
  setTimeout(() => {
    controller.abort();
  }, timeoutms);
  return signal;
}
