#include "gtk-deno/loop.h"
#include "gtk-deno/export.h"
#include <gtk/gtk.h>

static GMainLoop *g_loop = NULL;

static gboolean loop_quit_invoke(gpointer) {
  main_loop_quit();
  return false;
}

GTK_DENO void main_loop_run(void) {
  g_loop = g_main_loop_new(NULL, FALSE);
  g_main_loop_run(g_loop);
  g_main_loop_unref(g_loop);
  g_loop = NULL;
}

void main_loop_quit(void) {
  if (g_loop) {
    g_main_loop_quit(g_loop);
  }
}

GTK_DENO void worker_loop_quit(void) {
  g_main_context_invoke(NULL, loop_quit_invoke, NULL);
}
