#include <gtk/gtk.h>
#include <string.h>

static GtkWidget *label = NULL;

static gboolean set_label_cb(gpointer data) {
  gtk_label_set_text(GTK_LABEL(label), (const char *)data);
  g_free(data);
  return G_SOURCE_REMOVE;
}

void ui_set_label_text(const char *s) {
  g_main_context_invoke(NULL, set_label_cb, g_strdup(s));
}

static void on_activate(GtkApplication *app, gpointer user_data) {
  GtkWidget *window;

  window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), "Deno + GTK4");
  gtk_window_set_default_size(GTK_WINDOW(window), 200, 200);

  label = gtk_label_new("hello from GTK4");
  gtk_window_set_child(GTK_WINDOW(window), label);
  gtk_window_present(GTK_WINDOW(window));
}

int run_app(void) {
  GtkApplication *app;
  int status;

  app = gtk_application_new("dev.example.DenoGtk", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(app, "activate", G_CALLBACK(on_activate), NULL);
  status = g_application_run(G_APPLICATION(app), 0, NULL);
  g_object_unref(app);

  return status;
}
