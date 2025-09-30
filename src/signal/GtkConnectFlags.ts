/**
 * The connection flags are used to specify the behaviour of a signal’s connection.
 */
export enum GtkConnectFlags {
  /**
   * Default behaviour (no special flags).
   */
  G_CONNECT_DEFAULT = 0,
  /**
   * If set, the handler should be called after the default handler of the signal. Normally, the handler is called before the default handler.
   */
  G_CONNECT_AFTER = 1,
  /**
   * If set, the instance and data should be swapped when calling the handler; see `g_signal_connect_swapped()` for an example.
   */
  G_CONNECT_SWAPPED = 2,
}
