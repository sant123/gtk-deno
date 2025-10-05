#include "gtk-deno/core.h"

static gboolean ui_adapter_cb(gpointer data) {
  UiSync *s = data;
  gpointer r = s->job(s->seed);
  g_mutex_lock(&s->mutex);
  s->result = r;
  s->done = true;
  g_cond_signal(&s->condition_variable);
  g_mutex_unlock(&s->mutex);
  return false;
}

gpointer ui_call_sync(UiJob job, gpointer seed) {
  UiSync s;
  g_mutex_init(&s.mutex);
  g_cond_init(&s.condition_variable);
  s.done = false;
  s.job = job;
  s.seed = seed;
  s.result = NULL;

  g_mutex_lock(&s.mutex);
  g_main_context_invoke(NULL, ui_adapter_cb, &s);

  while (!s.done) {
    g_cond_wait(&s.condition_variable, &s.mutex);
  }

  g_mutex_unlock(&s.mutex);

  g_cond_clear(&s.condition_variable);
  g_mutex_clear(&s.mutex);
  return s.result;
}
