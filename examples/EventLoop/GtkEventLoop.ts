import { GtkApplication, GtkApplicationFlags } from "@onyx/gtk/GtkApplication";
import { GtkApplicationWindow } from "@onyx/gtk/GtkApplicationWindow";

const app = new GtkApplication(
  "org.gtk.example.event-loop",
  GtkApplicationFlags.G_APPLICATION_DEFAULT_FLAGS,
);

app.connect("activate", () => {
  const window = new GtkApplicationWindow(app);
  window.title = "gtk-deno event-loop observation";
  window.setDefaultSize(480, 280);

  let ticks = 0;
  const timer = setInterval(() => {
    ticks++;
    console.log(`Deno timer tick ${ticks}`);
    Promise.resolve().then(() => console.log("Deno promise callback"));
  }, 1000);

  window.connect("close-request", () => {
    clearInterval(timer);
    return 0;
  });
  window.present();
});

app.run();
