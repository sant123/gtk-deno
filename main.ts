import { lib } from "lib";
import { getPtrFromString } from "utils";
import { ref, unref } from "loop";

class Clipboard {
  #clipboardPtr: Deno.PointerValue;

  constructor() {
    lib.symbols.gtk_init();
    const display = lib.symbols.gdk_display_get_default();
    this.#clipboardPtr = lib.symbols.gdk_display_get_clipboard(display);
    ref(this.#clipboardPtr);
  }

  setText(str: string) {
    lib.symbols.gdk_clipboard_set_text(
      this.#clipboardPtr,
      getPtrFromString(str),
    );
  }

  dispose() {
    unref(this.#clipboardPtr);
  }

  [Symbol.dispose]() {
    this.dispose();
  }
}

using clip = new Clipboard();
clip.setText("Sandman");
