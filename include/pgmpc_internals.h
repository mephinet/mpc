#ifndef MPC_INTERNALS_H
#define MPC_INTERNALS_H

#include "mpd/client.h"

bool pgmpc_check_and_reconnect(pgmpc*);
void pgmpc_error(const char*);
void pgmpc_free_state(pgmpc*);

struct pgmpc_t {
  struct mpd_connection* connection;

  char* host;
  unsigned int port;

  unsigned int elapsed_time;
  unsigned int total_time;
  bool random;
  bool repeat;

  char* current_artist;
  char* current_title;
  char* current_filename;
  char* state;
  int current_volume;
  int current_songid;
  int queue_version;
};

#endif
