import { assert } from "@std/assert";
import { delay } from "@std/async";
import * as v from "valibot";

import {
  GtkFileDialogDefaultSchema,
  GtkFileDialogOkSchema,
  GtkFileDialogResultSchema,
  GtkFileDialogResultsSchema,
} from "./misc/schemas.ts";

import { GtkDialogResult } from "./misc/types.ts";
import { GtkOpenFileDialog } from "./GtkOpenFileDialog.ts";

Deno.test("GtkOpenFileDialog()", async (t) => {
  using dialog = new GtkOpenFileDialog();
  v.assert(GtkFileDialogDefaultSchema, dialog);

  let result = await dialog.showDialog();
  v.assert(GtkFileDialogResultSchema, result);

  await t.step("OkResult", () => {
    assert(
      result === GtkDialogResult.OK,
      "You must select a file in this step!",
    );
    v.assert(GtkFileDialogOkSchema, dialog);
  });

  result = await dialog.showDialog();
  v.assert(GtkFileDialogResultSchema, result);

  await t.step("CancelResult", () => {
    assert(result === GtkDialogResult.Cancel, "You must cancel in this step!");
    v.assert(GtkFileDialogDefaultSchema, dialog);
  });
});

Deno.test("Single instance and multiple calls to showDialog() are serial", async () => {
  using dialog = new GtkOpenFileDialog();
  v.assert(GtkFileDialogDefaultSchema, dialog);

  const results = await Promise.all([
    dialog.showDialog(),
    dialog.showDialog(),
    dialog.showDialog(),
  ]);

  v.assert(GtkFileDialogResultsSchema, results);
  console.log(results.map((r) => GtkDialogResult[r]));
});

Deno.test("Multiple instance and multiple calls to showDialog() are parallel", async () => {
  using d1 = new GtkOpenFileDialog();
  d1.title = "d1";
  d1.acceptLabel = "Open for d1";
  v.assert(GtkFileDialogDefaultSchema, d1);

  using d2 = new GtkOpenFileDialog();
  d2.title = "d2";
  d2.acceptLabel = "Open for d2";
  v.assert(GtkFileDialogDefaultSchema, d2);

  using d3 = new GtkOpenFileDialog();
  d3.title = "d3";
  d3.acceptLabel = "Open for d3";
  v.assert(GtkFileDialogDefaultSchema, d3);

  const results = await Promise.all([
    d1.showDialog(),
    d2.showDialog(),
    d3.showDialog(),
  ]);

  v.assert(GtkFileDialogResultsSchema, results);
  console.log(results.map((r) => GtkDialogResult[r]));
});

Deno.test("Return abort in showDialog() if GtkFileDialog is disposed early", async () => {
  const dialog = new GtkOpenFileDialog();
  v.assert(GtkFileDialogDefaultSchema, dialog);

  dialog.dispose();
  const result = await dialog.showDialog();
  assert(result === GtkDialogResult.Abort);
});

Deno.test("After dialog is open, return abort in showDialog() if GtkFileDialog is disposed early", async () => {
  const dialog = new GtkOpenFileDialog();
  v.assert(GtkFileDialogDefaultSchema, dialog);
  const result = dialog.showDialog();

  await delay(3000);
  dialog.dispose();
  assert(await result === GtkDialogResult.Abort);
});

Deno.test("Dispose more than once should be no-op", () => {
  using dialog = new GtkOpenFileDialog();
  dialog.dispose();
});
