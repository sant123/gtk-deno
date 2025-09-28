import { lib } from "lib";
import { getPtrFromString } from "utils";
import { ref, unref } from "loop";

const onClose = new Deno.UnsafeCallback({
  parameters: ["pointer", "pointer"],
  result: "bool",
}, (appPtr) => {
  unref(appPtr);
  return false;
});

const onActivate = new Deno.UnsafeCallback({
  parameters: ["pointer", "pointer"],
  result: "void",
}, (appPtr) => {
  const win = lib.symbols.gtk_application_window_new(appPtr);

  lib.symbols.g_signal_connect_data(
    win,
    getPtrFromString("close-request"),
    onClose.pointer,
    appPtr,
    null,
    2,
  );

  lib.symbols.gtk_window_set_title(win, getPtrFromString("Window"));
  lib.symbols.gtk_window_set_default_size(win, 800, 600);
  lib.symbols.gtk_window_present(win);
});

const app = lib.symbols.gtk_application_new(
  getPtrFromString("org.gtk.deno.example"),
  0,
);

lib.symbols.g_signal_connect_data(
  app,
  getPtrFromString("activate"),
  onActivate.pointer,
  null,
  null,
  0,
);

lib.symbols.g_application_register(app, null, null);
lib.symbols.g_application_activate(app);
ref(app);
