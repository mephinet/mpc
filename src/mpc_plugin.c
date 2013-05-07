#include "SDL.h"
#include "PDL.h"
#include "pgmpc.h"
#include "syslog.h"
#include "mpc_plugin.h"
#include "mpc_callbacks.h"
#include "mpc_timers.h"

unsigned int queue_version = 0;

void update_queue(pgmpc*);
void update_playlists(pgmpc*);

void send_error(const char* s) {
  char *params[1];
  if(!s) {
    s = "(unknown)";
  }
  syslog(LOG_ERR, s);
  params[0] = strdup(s);
  PDL_CallJS("plugin_error", (const char**) params, 1);
  free(params[0]); params[0] = NULL;
}

int _call_js_wrapper(const char* method, const char* json) {
    const char *params[1];
    params[0] = json;
    if(PDL_CallJS(method, (const char **) params, 1) != PDL_NOERROR) {
      syslog(LOG_ERR, "Failed calling %s!", method);
      return 0;
    };
    return 1;
}

void update_status(pgmpc* mpc) {
  if (!pgmpc_update_state(mpc)) {
    send_error(pgmpc_get_error());
    pgmpc_clear_error();
    return;
  }

  char* json = pgmpc_get_status(mpc);
  if (json) {
    _call_js_wrapper("update_status", json);
    free(json); json = NULL;
  } else {
    send_error(pgmpc_get_error());
    pgmpc_clear_error();
  }

  unsigned int ver = pgmpc_queue_version(mpc);
  if (ver > queue_version) {
    queue_version = ver;
    update_queue(mpc);
  }
}

void update_queue(pgmpc* mpc) {
  char* json = pgmpc_get_queue(mpc);
  if (json) {
    _call_js_wrapper("update_queue", json);
    free(json); json = NULL;
  } else {
    send_error(pgmpc_get_error());
    pgmpc_clear_error();
  }
}

void update_playlists(pgmpc* mpc) {
  char* json = pgmpc_get_playlists(mpc);
  if (json) {
    _call_js_wrapper("update_playlists", json);
    free(json); json = NULL;
  } else {
    send_error(pgmpc_get_error());
    pgmpc_clear_error();
  }
}

void set_volume(pgmpc* mpc, int new) {
  if (new >= 0) {
    if(!pgmpc_set_volume(mpc, new)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    };
  }
}

void handle_event(SDL_Event* event, pgmpc* mpc) {
  int* value = event->user.data1;

  char* host = event->user.data1;
  int* portp = event->user.data2;

  char* playlist = event->user.data1;

  switch (event->user.code) {
  case EVENT_CODE_CONNECT:
    pgmpc_disconnect(mpc);
    if(!pgmpc_connect(mpc, host, *portp)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    free(host); host = NULL;
    free(portp); portp = NULL;
    update_playlists(mpc);
    break;
  case EVENT_CODE_PLAY:
    if(!pgmpc_play(mpc)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    break;
  case EVENT_CODE_PLAY_BY_ID:
    if(!pgmpc_play_by_id(mpc, *value)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    free(value); value = NULL;
    break;
  case EVENT_CODE_PAUSE:
    if(!pgmpc_pause(mpc)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    break;
  case EVENT_CODE_STOP:
    if(!pgmpc_stop(mpc)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    break;
  case EVENT_CODE_CROP:
    if(!pgmpc_crop(mpc)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    break;
  case EVENT_CODE_NEXT:
    if(!pgmpc_next(mpc)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    break;
  case EVENT_CODE_TIMER:
    update_status(mpc);
    break;
  case EVENT_CODE_SET_VOLUME:
    if(value) {      
      set_volume(mpc, *value);
      free(value); value = NULL;
    } else {
      syslog(LOG_ERR, "set_volume called with NULL volume pointer");
    }
    break;
  case EVENT_CODE_SET_RANDOM:
    if(value) {
      if(!pgmpc_set_random(mpc, *value)) {
        send_error(pgmpc_get_error());
        pgmpc_clear_error();
      }
      free(value); value = NULL;
    } else {
      syslog(LOG_ERR, "set_random called with NULL volume pointer");
    }
    break;
  case EVENT_CODE_SET_REPEAT:
    if(value) {
      if(!pgmpc_set_repeat(mpc, *value)) {
        send_error(pgmpc_get_error());
        pgmpc_clear_error();
      }
      free(value); value = NULL;
    } else {
      syslog(LOG_ERR, "set_repeat called with NULL volume pointer");
    }
    break;
  case EVENT_CODE_LOAD_PLAYLIST:
    if(!pgmpc_load_playlist(mpc, playlist)) {
      send_error(pgmpc_get_error());
      pgmpc_clear_error();
    }
    free(playlist); playlist = NULL;
    break;
  }
}

int main (void) {

  if(SDL_Init(SDL_INIT_VIDEO | SDL_INIT_TIMER) != 0) {
    send_error("SDL init failed");
    exit(1);
  }
  PDL_Init(0);

  if(register_callbacks() == 0) {
    send_error("Error registering callbacks");
    exit(1);
  };

  PDL_CallJS("ready", NULL, 0);

  pgmpc* mpc = NULL;
  mpc = pgmpc_new();
  if(!mpc) {
    send_error(pgmpc_get_error());
    exit(1);
  }

  set_periodic_timer();

  SDL_Event event;
  do {
    SDL_WaitEvent(&event);

    if (event.type == SDL_USEREVENT) {
      handle_event(&event, mpc);
    }
  } while (event.type != SDL_QUIT);

  pgmpc_free(mpc); mpc = NULL;

  PDL_Quit();
  SDL_Quit();
  return 0;
}
