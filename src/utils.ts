import { GError } from "types";
import { lib } from "lib";

export function getGErrorFromPtr(
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

export function getFileNameFromGFile(ptr: Deno.PointerValue<unknown>): string {
  if (!ptr) {
    return "";
  }

  /**
   * @pointer char*
   */
  const pathPtr = lib.symbols.g_file_get_path(ptr);

  if (!pathPtr) {
    return "";
  }

  const fileName = Deno.UnsafePointerView.getCString(pathPtr);

  /**
   * @release char*
   */
  lib.symbols.g_free(pathPtr);

  /**
   * @release GFile
   */
  lib.symbols.g_object_unref(ptr);

  return fileName;
}
