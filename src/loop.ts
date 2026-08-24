import { lib } from "lib";
import { PollingEventLoop } from "./PollingEventLoop.ts";

lib.symbols.gtk_init();

const eventLoop = new PollingEventLoop({
  // `iteration()` returning false means the drain is complete, so a separate
  // g_main_context_pending() check would not change the scheduling decision.
  iteration: () => lib.symbols.g_main_context_iteration(null, false),
});

export function ref(ptr: Deno.PointerValue): void {
  eventLoop.ref(Deno.UnsafePointer.value(ptr));
}

export function unref(ptr: Deno.PointerValue): void {
  eventLoop.unref(Deno.UnsafePointer.value(ptr));
}
