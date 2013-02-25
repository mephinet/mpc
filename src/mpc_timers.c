#include "SDL.h"
#include "mpc_plugin.h"
#include "mpc_timers.h"

#define TIMER_INTERVAL 1000

Uint32 timer_callback(Uint32 interval, void* param) {
  param = param;
  SDL_Event event;
  event.user.type = SDL_USEREVENT;
  event.user.code = EVENT_CODE_TIMER;
  SDL_PushEvent(&event);

  // keep tickin'
  return interval;
}

void set_periodic_timer(void) {
  SDL_AddTimer(TIMER_INTERVAL, timer_callback, NULL);
}
