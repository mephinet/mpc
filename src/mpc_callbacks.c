#include "PDL.h"
#include "mpc_callbacks.h"
#include "mpc_plugin.h"

void push_event(int code) {
  SDL_Event event;
  event.user.type = SDL_USEREVENT;
  event.user.code = code;
  SDL_PushEvent(&event);
}

void push_event_with_int(int code, PDL_JSParameters* params) {
  SDL_Event event;

  int *valuep = malloc(sizeof(int));
  *valuep = PDL_GetJSParamInt(params, 0);

  event.user.type = SDL_USEREVENT;
  event.user.code = code;
  event.user.data1 = valuep;
  SDL_PushEvent(&event);
}

static PDL_bool connect(PDL_JSParameters* params) {
  SDL_Event event;

  const char* host = NULL;
  int *portp = malloc(sizeof(int));
  host = PDL_GetJSParamString(params, 0);
  *portp = PDL_GetJSParamInt(params, 1);

  event.user.type = SDL_USEREVENT;
  event.user.code = EVENT_CODE_CONNECT;
  event.user.data1 = strdup(host);
  event.user.data2 = portp;
  SDL_PushEvent(&event);

  return PDL_TRUE;
}

static PDL_bool play(PDL_JSParameters* params) {
  params = params;
  push_event(EVENT_CODE_PLAY);
  return PDL_TRUE;
}

static PDL_bool pause(PDL_JSParameters* params) {
  params = params;
  push_event(EVENT_CODE_PAUSE);
  return PDL_TRUE;
}

static PDL_bool play_by_id(PDL_JSParameters* params) {
  push_event_with_int(EVENT_CODE_PLAY_BY_ID, params);
  return PDL_TRUE;
}

static PDL_bool play_next_by_id(PDL_JSParameters* params) {
  push_event_with_int(EVENT_CODE_PLAY_NEXT_BY_ID, params);
  return PDL_TRUE;
}

static PDL_bool stop(PDL_JSParameters* params) {
  params = params;
  push_event(EVENT_CODE_STOP);
  return PDL_TRUE;
}

static PDL_bool crop(PDL_JSParameters* params) {
  params = params;
  push_event(EVENT_CODE_CROP);
  return PDL_TRUE;
}

static PDL_bool next(PDL_JSParameters* params) {
  params = params;
  push_event(EVENT_CODE_NEXT);
  return PDL_TRUE;
}

static PDL_bool set_volume(PDL_JSParameters* params) {
  push_event_with_int(EVENT_CODE_SET_VOLUME, params);
  return PDL_TRUE;
}

static PDL_bool set_random(PDL_JSParameters* params) {
  push_event_with_int(EVENT_CODE_SET_RANDOM, params);
  return PDL_TRUE;
}

static PDL_bool set_repeat(PDL_JSParameters* params) {
  push_event_with_int(EVENT_CODE_SET_REPEAT, params);
  return PDL_TRUE;
}

static PDL_bool load_playlist(PDL_JSParameters* params) {
  SDL_Event event;

  const char* playlist = NULL;
  playlist = PDL_GetJSParamString(params, 0);

  event.user.type = SDL_USEREVENT;
  event.user.code = EVENT_CODE_LOAD_PLAYLIST;
  event.user.data1 = strdup(playlist);
  SDL_PushEvent(&event);

  return PDL_TRUE;
}

int register_callbacks(void) {
  if(PDL_RegisterJSHandler("connect", connect) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("play", play) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("pause", pause) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("play_by_id", play_by_id) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("stop", stop) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("crop", crop) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("next", next) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("set_volume_by_app", set_volume) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("set_random", set_random) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("set_repeat", set_repeat) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("load_playlist", load_playlist) != PDL_NOERROR) {
    return 0;
  }
  if(PDL_RegisterJSHandler("play_next_by_id", play_next_by_id) != PDL_NOERROR) {
    return 0;
  }

  if(PDL_JSRegistrationComplete() != PDL_NOERROR) {
    return 0;
  }
  return 1;
}
