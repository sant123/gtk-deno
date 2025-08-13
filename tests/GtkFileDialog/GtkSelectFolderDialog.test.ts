import { assert } from "@std/assert";
import { delay } from "@std/async";
import * as v from "valibot";

import {
  GtkSelectFolderDialogDefaultSchema,
  GtkSelectFolderDialogOkSchema,
  MultipleChoice,
  SingleChoice,
} from "./schemas.ts";

import {
  GtkDialogResult,
  GtkSelectFolderDialog,
} from "@onyx/gtk/GtkFileDialog";

Deno.test("GtkSelectFolderDialog()", async (t) => {
  using dialog = new GtkSelectFolderDialog();
  v.assert(GtkSelectFolderDialogDefaultSchema, dialog);

  let result = await dialog.showDialog();
  v.assert(SingleChoice, result);

  await t.step("OkResult", () => {
    assert(
      result === GtkDialogResult.OK,
      "You must select a folder in this step!",
    );
    v.assert(GtkSelectFolderDialogOkSchema, dialog);
  });

  result = await dialog.showDialog();
  v.assert(SingleChoice, result);

  await t.step("CancelResult", () => {
    assert(result === GtkDialogResult.Cancel, "You must cancel in this step!");
    v.assert(GtkSelectFolderDialogDefaultSchema, dialog);
  });
});

Deno.test("Single instance and multiple calls to showDialog() are serial", async () => {
  using dialog = new GtkSelectFolderDialog();
  v.assert(GtkSelectFolderDialogDefaultSchema, dialog);

  const results = await Promise.all([
    dialog.showDialog(),
    dialog.showDialog(),
    dialog.showDialog(),
  ]);

  v.assert(MultipleChoice, results);
  console.log(results.map((r) => GtkDialogResult[r]));
});

Deno.test("Multiple instance and multiple calls to showDialog() are parallel", async () => {
  using d1 = new GtkSelectFolderDialog();
  d1.acceptLabel = "Select for d1";
  d1.title = "d1";
  v.assert(GtkSelectFolderDialogDefaultSchema, d1);

  using d2 = new GtkSelectFolderDialog();
  d2.acceptLabel = "Select for d2";
  d2.title = "d2";
  v.assert(GtkSelectFolderDialogDefaultSchema, d2);

  using d3 = new GtkSelectFolderDialog();
  d3.acceptLabel = "Select for d3";
  d3.title = "d3";
  v.assert(GtkSelectFolderDialogDefaultSchema, d3);

  const results = await Promise.all([
    d1.showDialog(),
    d2.showDialog(),
    d3.showDialog(),
  ]);

  v.assert(MultipleChoice, results);
  console.log(results.map((r) => GtkDialogResult[r]));
});

Deno.test("Return abort in showDialog() if GtkFileDialog is disposed early", async () => {
  const dialog = new GtkSelectFolderDialog();
  v.assert(GtkSelectFolderDialogDefaultSchema, dialog);

  dialog.dispose();
  const result = await dialog.showDialog();
  assert(result === GtkDialogResult.Abort);
});

Deno.test("After dialog is open, return abort in showDialog() if GtkFileDialog is disposed early", async () => {
  const dialog = new GtkSelectFolderDialog();
  v.assert(GtkSelectFolderDialogDefaultSchema, dialog);
  const result = dialog.showDialog();

  await delay(3000);
  dialog.dispose();
  assert(await result === GtkDialogResult.Abort);
});

Deno.test("Dispose more than once should be no-op", () => {
  using dialog = new GtkSelectFolderDialog();
  dialog.dispose();
});
