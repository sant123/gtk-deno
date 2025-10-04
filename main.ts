import { getPtrFromString } from "utils";

const lib = Deno.dlopen("builddir/libgtk_deno.so", {
  run_app: {
    parameters: [],
    result: "i32",
  },
  ui_set_label_text: {
    parameters: ["pointer"],
    result: "void",
  },
});

const url = new URL(import.meta.url);
const isMainThread = !url.searchParams.has("worker");

if (isMainThread) {
  const w = new Worker(`${import.meta.url}?worker=1`, { type: "module" });
  const status = lib.symbols.run_app();
  console.log("Got status from app %d", status);
  w.terminate();
} else {
  const cstr = getPtrFromString("Hellouuuu from Deno Workersito!");
  lib.symbols.ui_set_label_text(cstr);
}
