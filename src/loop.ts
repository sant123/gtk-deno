import { lib } from "lib";

const instances = new Set<unknown>();
let intervalId = 0;

function startGtkEventLoop() {
  intervalId = setInterval(() => {
    lib.symbols.g_main_context_iteration(null, false);
  }, 100);
}

export function ref(instance: unknown) {
  instances.add(instance);

  if (instances.size === 1) {
    startGtkEventLoop();
  }
}

export function unref(instance: unknown) {
  instances.delete(instance);

  if (!instances.size) {
    clearInterval(intervalId);
  }
}
