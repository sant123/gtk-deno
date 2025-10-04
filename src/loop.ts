import { lib } from "lib";

lib.symbols.gtk_init();

const instances = new Set<bigint>();

const MAX_GL_ITER_PER_TICK = 64; // cap how much GTK work we do per tick
const FAST_REPOST = 0; // immediate reschedule when still work
const IDLE_DELAY_MS = 16; // ~60 Hz when idle (can raise to 33)
const LONG_IDLE_DELAY_MS = 100; // 10 Hz after long idle
const LONG_IDLE_CUTOFF = 200; // same meaning as your code

let idleTicks = 0;
let running = false;
let scheduled = false;

function driveOnce(): boolean {
  // Run one non-blocking iteration; returns true if something ran.
  return lib.symbols.g_main_context_iteration(null, false);
}

function tick() {
  scheduled = false;

  let did = false;
  let n = 0;

  // Do a bounded amount of work to preserve fairness with Deno.
  while (n < MAX_GL_ITER_PER_TICK && driveOnce()) {
    did = true;
    n++;
  }

  // If we hit the cap or GLib still has pending work, repost immediately.
  // NOTE: using iteration(false) above *already* drained ready sources;
  // we check pending after to decide how aggressively to repost.
  const stillPending = lib.symbols.g_main_context_pending(null);

  if (did || stillPending) {
    idleTicks = 0;
    // Immediate repost once to keep latency low without spinning.
    schedule(FAST_REPOST);
  } else if (running) {
    // Back off when idle.
    idleTicks++;
    const delay = idleTicks > LONG_IDLE_CUTOFF
      ? LONG_IDLE_DELAY_MS
      : IDLE_DELAY_MS;
    schedule(delay);
  }
}

function schedule(delay: number) {
  if (scheduled) {
    return;
  }

  scheduled = true;
  setTimeout(tick, delay);
  console.log(delay);
}

function start(): void {
  if (running) {
    return;
  }

  running = true;
  scheduled = false;
  idleTicks = 0;
  schedule(0);
}

function stop(): void {
  running = false;
  scheduled = false;
  idleTicks = 0;
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
