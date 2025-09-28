import { lib } from "lib";

const instances = new Set<unknown>();

let running = false;
let scheduled = false;

let idleBackoffMs = 1;
const MAX_BACKOFF_MS = 16; // 1000 / 16 = 62.5 Hz

let spinCount = 0;
const YIELD_EVERY = 50; // Cycles

function drainGtkOnce(): boolean {
  return lib.symbols.g_main_context_iteration(null, false);
}

function pump(): void {
  let didWork = false;
  scheduled = false;

  while (drainGtkOnce()) {
    didWork = true;
  }

  if (!running) {
    return;
  }

  if (didWork) {
    idleBackoffMs = 1;

    if (++spinCount === YIELD_EVERY) {
      spinCount = 0;
      setTimeout(schedule, 0);
    } else {
      queueMicrotask(schedule);
    }
  } else {
    spinCount = 0;
    setTimeout(schedule, idleBackoffMs);

    if (idleBackoffMs < MAX_BACKOFF_MS) {
      idleBackoffMs <<= 1;
    }
  }
}

function schedule(): void {
  if (!running || scheduled) {
    return;
  }

  scheduled = true;
  queueMicrotask(pump);
}

function start(): void {
  if (running) {
    return;
  }

  running = true;
  idleBackoffMs = 1;
  spinCount = 0;
  schedule();
}

function stop(): void {
  running = false;
  scheduled = false;
}

export function ref(instance: unknown): void {
  instances.add(instance);

  if (instances.size === 1) {
    start();
  }
}

export function unref(instance: unknown): void {
  instances.delete(instance);

  if (instances.size === 0) {
    stop();
  }
}
