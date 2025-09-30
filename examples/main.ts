import { GtkApplication, GtkApplicationFlags } from "@onyx/gtk/GtkApplication";
import { GtkApplicationWindow } from "@onyx/gtk/GtkApplicationWindow";

const app = new GtkApplication(
  "org.gtk.deno.example",
  GtkApplicationFlags.G_APPLICATION_DEFAULT_FLAGS,
);

app.connect("activate", () => {
  const win = new GtkApplicationWindow(app);

  win.title = "Window";
  win.setDefaultSize(800, 600);
  win.present();

  console.log("Activated");

  win.connect("close-request", () => {
    console.log("Trying to close?");
    return false;
  });
});

app.run();

// console.log(Deno[Deno.internal].core.resources());
