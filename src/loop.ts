import { lib } from "lib";

const instances = new Set<bigint>();

let running = false;
let scheduled = false;
let delayMs = 1;
let timerId: number | null = null;

const BUSY_MIN_MS = 1;
const IDLE_MAX_MS = 16; // 60 Hz

const MAX_ITERS_PER_PUMP = 1000;
const TIME_BUDGET_MS = 8;

function drainGtkOnce(): boolean {
  return lib.symbols.g_main_context_iteration(null, false);
}

function pump(): void {
  scheduled = false;
  timerId = null;

  let didWork = false;
  const deadline = performance.now() + TIME_BUDGET_MS;

  for (let i = 0; i < MAX_ITERS_PER_PUMP; i++) {
    const dispatched = drainGtkOnce();

    if (!dispatched) {
      break;
    }

    didWork = true;

    if (performance.now() >= deadline) {
      break;
    }
  }

  if (!running) {
    return;
  }

  delayMs = didWork ? BUSY_MIN_MS : Math.min((delayMs || 1) << 1, IDLE_MAX_MS);
  schedule();
}

function schedule(): void {
  if (!running || scheduled) {
    return;
  }

  scheduled = true;
  timerId = setTimeout(pump, delayMs);
}

function start(): void {
  if (running) {
    return;
  }

  running = true;
  delayMs = 1;
  schedule();
}

function stop(): void {
  running = false;
  scheduled = false;

  if (timerId !== null) {
    clearTimeout(timerId);
    timerId = null;
  }
}

export function ref(ptr: Deno.PointerValue<unknown>): void {
  const ptrValue = Deno.UnsafePointer.value(ptr);

  if (ptrValue === 0n) {
    return;
  }

  instances.add(ptrValue);

  if (instances.size === 1) {
    start();
  }
}

export function unref(ptr: Deno.PointerValue<unknown>): void {
  const ptrValue = Deno.UnsafePointer.value(ptr);

  if (ptrValue === 0n) {
    return;
  }

  instances.delete(ptrValue);

  if (instances.size === 0) {
    stop();
  }
}
