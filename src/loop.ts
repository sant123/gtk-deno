import { lib } from "lib";

lib.symbols.gtk_init();

const instances = new Set<bigint>();

const FAST = 1; // 1000 hz;
const SLOW = 16; // ~60 hz;
const IDLE = 100; // 10 hz
const BURST_MAX = 100;
const LONG_IDLE_CUTOFF = 200;

let delay = SLOW;
let burst = 0;
let idleTicks = 0;
let running = false;
let ticking = false;

function schedule() {
  if (ticking) {
    return;
  }

  ticking = true;

  let did = false;

  while (lib.symbols.g_main_context_iteration(null, false)) {
    did = true;
  }

  const pending = lib.symbols.g_main_context_pending(null);

  if (did || pending) {
    idleTicks = 0;
    if (burst < BURST_MAX) {
      burst++;
      delay = FAST;
    } else {
      delay = SLOW;
    }
  } else {
    burst = 0;
    idleTicks++;
    delay = idleTicks > LONG_IDLE_CUTOFF ? IDLE : SLOW;
  }

  ticking = false;

  if (running || did) {
    setTimeout(schedule, delay);
  }
}

function start(): void {
  if (running) {
    return;
  }

  running = true;
  schedule();
}

function stop(): void {
  running = false;
  burst = 0;
  idleTicks = 0;
  delay = SLOW;
}

export function ref(ptr: Deno.PointerValue): void {
  const v = Deno.UnsafePointer.value(ptr);

  if (v === 0n) {
    return;
  }

  instances.add(v);

  if (instances.size === 1) {
    start();
  }
}

export function unref(ptr: Deno.PointerValue): void {
  const v = Deno.UnsafePointer.value(ptr);

  if (v === 0n) {
    return;
  }

  instances.delete(v);

  if (instances.size === 0) {
    stop();
  }
}
