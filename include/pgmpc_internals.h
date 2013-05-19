#ifndef MPC_INTERNALS_H
#define MPC_INTERNALS_H

#include "mpd/client.h"

bool pgmpc_check_and_reconnect(pgmpc*, const char* func);
bool pgmpc_check(pgmpc*, bool, const char* func);
void pgmpc_error(const char* func, const char* errstr);
void pgmpc_free_state(pgmpc*);

struct pgmpc_t {
  struct mpd_connection* connection;

  char* host;
  unsigned int port;
  bool prio_support;

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
  int current_songpos;
  int queue_version;
  unsigned int queue_length;
};

#define RANGE_END (0x7fffffff)

#endif
