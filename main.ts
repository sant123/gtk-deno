// export function getPtrFromString(str: string): Deno.PointerValue<unknown> {
//   const bytes = new TextEncoder().encode(str + "\0");
//   const stringPtr = Deno.UnsafePointer.of(bytes);

//   return stringPtr;
// }

const lib = Deno.dlopen("build/libgtk_deno.so", {
  main_gtk_init: {
    parameters: [],
    result: "void",
  },
  main_loop_run: {
    parameters: [],
    result: "void",
  },
  worker_run_app: {
    parameters: [],
    result: "void",
  },
  worker_loop_quit: {
    parameters: [],
    result: "void",
  },
});

const url = new URL(import.meta.url);
const isMainThread = !url.searchParams.has("worker");

if (isMainThread) {
  lib.symbols.main_gtk_init();
  const w = new Worker(`${import.meta.url}?worker`, { type: "module" });
  lib.symbols.main_loop_run();
  console.log("Return from main loop run!");
  w.terminate();
} else {
  lib.symbols.worker_run_app();
}
