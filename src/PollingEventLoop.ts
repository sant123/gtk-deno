/** Polling interval used only after GLib has no immediately dispatchable work. */
export const IDLE_POLL_INTERVAL = 16;

type Timer = ReturnType<typeof setTimeout>;

export interface LoopScheduler {
  setTimeout(callback: () => void, delay: number): Timer;
  clearTimeout(timer: Timer): void;
}

export interface MainContext {
  /**
   * Runs one available GLib source. `false` is essential: GLib must never
   * block Deno's JavaScript event loop while waiting for a source.
   */
  iteration(): boolean;
}

const defaultScheduler: LoopScheduler = { setTimeout, clearTimeout };

/**
 * Keeps a GLib main context moving while GTK-backed objects exist.
 *
 * A tick drains all currently available GLib work. Work is followed by a
 * zero-delay timer, which yields a macrotask turn to Deno before polling GLib
 * again; this avoids a microtask chain starving Deno timers and I/O. `timer`
 * is the only scheduled state: its presence means the loop is scheduled.
 */
export class PollingEventLoop {
  #instances = new Set<bigint>();
  #running = false;
  #timer: Timer | undefined;

  constructor(
    private readonly context: MainContext,
    private readonly scheduler: LoopScheduler = defaultScheduler,
  ) {}

  get referenceCount(): number {
    return this.#instances.size;
  }

  get isRunning(): boolean {
    return this.#running;
  }

  get isScheduled(): boolean {
    return this.#timer !== undefined;
  }

  ref(instance: bigint): void {
    if (instance === 0n || this.#instances.has(instance)) return;
    this.#instances.add(instance);
    if (this.#instances.size === 1) this.start();
  }

  unref(instance: bigint): void {
    if (instance === 0n || !this.#instances.delete(instance)) return;
    if (this.#instances.size === 0) this.stop();
  }

  private start(): void {
    if (this.#running) return;
    this.#running = true;
    this.schedule(0);
  }

  private stop(): void {
    this.#running = false;
    if (this.#timer !== undefined) {
      this.scheduler.clearTimeout(this.#timer);
      this.#timer = undefined;
    }
  }

  private schedule(delay: number): void {
    if (!this.#running || this.#timer !== undefined) return;
    this.#timer = this.scheduler.setTimeout(() => this.tick(), delay);
  }

  private tick(): void {
    this.#timer = undefined;
    if (!this.#running) return;

    let didWork = false;
    while (this.#running && this.context.iteration()) didWork = true;
    if (!this.#running) return;

    // A timer task, rather than a microtask continuation, preserves Deno fairness.
    this.schedule(didWork ? 0 : IDLE_POLL_INTERVAL);
  }
}
