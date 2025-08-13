import type { GError } from "types";
import { lib } from "lib";

export const GtkSymbol = Symbol("GtkSymbol");

export function getGErrorFromDoublePtr(
  ptr: Deno.PointerValue<unknown>,
): GError | null {
  if (!ptr) {
    return null;
  }

  /**
   * @pointer GError
   */
  const structPtr = new Deno.UnsafePointerView(ptr).getPointer();

  if (!structPtr) {
    return null;
  }

  const struct = new Deno.UnsafePointerView(structPtr);

  const domain = struct.getInt32(0);
  const code = struct.getInt32(4);
  const message = Deno.UnsafePointerView.getCString(struct.getPointer(8)!);

  /**
   * @release GError
   */
  lib.symbols.g_error_free(structPtr);

  return { domain, code, message };
}

export function getPathFromGFile(ptr: Deno.PointerValue<unknown>): string {
  if (!ptr) {
    return "";
  }

  /**
   * @pointer char
   */
  const pathPtr = lib.symbols.g_file_get_path(ptr);

  if (!pathPtr) {
    return "";
  }

  const fileName = Deno.UnsafePointerView.getCString(pathPtr);

  /**
   * @release char
   */
  lib.symbols.g_free(pathPtr);

  /**
   * @release GFile
   */
  lib.symbols.g_object_unref(ptr);

  return fileName;
}

export function getStringFromDoublePtr(
  ptr: Deno.PointerValue<unknown>,
): string {
  if (!ptr) {
    return "";
  }

  const stringPtr = new Deno.UnsafePointerView(ptr).getPointer();

  if (!stringPtr) {
    return "";
  }

  return Deno.UnsafePointerView.getCString(stringPtr);
}

export function getPtrFromString(str: string): Deno.PointerValue<unknown> {
  const bytes = new TextEncoder().encode(str + "\0");
  const stringPtr = Deno.UnsafePointer.of(bytes);

  return stringPtr;
}
