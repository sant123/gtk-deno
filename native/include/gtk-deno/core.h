#pragma once

#include <gtk/gtk.h>

typedef gpointer (*UiJob)(gpointer seed);

typedef struct {
  GMutex mutex;
  GCond condition_variable;
  gboolean done;
  UiJob job;
  gpointer seed;
  gpointer result;
} UiSync;

gpointer ui_call_sync(UiJob, gpointer);
