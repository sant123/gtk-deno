#pragma once

#if defined(_WIN32) || defined(__CYGWIN__)
  #if defined(GTK_DENO_BUILDING_DLL)
    #define GTK_DENO __declspec(dllexport)
  #elif defined(GTK_DENO_USING_DLL)
    #define GTK_DENO __declspec(dllimport)
  #else
    #define GTK_DENO
  #endif
#else
  #if __GNUC__ >= 4 || defined(__clang__)
    #define GTK_DENO __attribute__((visibility("default")))
  #else
    #define GTK_DENO
  #endif
#endif
