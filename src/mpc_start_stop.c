#include <unistd.h>
#include <stdio.h>
#include "pgmpc.h"
#include <assert.h>
#include <stdlib.h>

int main (int argc, char** argv) {

  pgmpc* mpc = NULL;
  int res;
  const char* host = "sniper2.gortan.local";
  unsigned int port = 6600;

  if (argc >= 2) {
    host = argv[1];
  }
    
  fprintf(stderr, "Creating pgmpc instance...\n");
  mpc = pgmpc_new();
  assert(mpc);

  fprintf(stderr, "Connecting to %s:%d...\n", host, port);
  res = pgmpc_connect(mpc, host, port);
  assert(res);

  fprintf(stderr, "Starting playback...\n");
  res = pgmpc_play(mpc);
  assert(res);
  sleep(3);

  fprintf(stderr, "Stopping playback...\n");
  res = pgmpc_stop(mpc);
  assert(res);

  fprintf(stderr, "Closing connection...\n");
  pgmpc_disconnect(mpc);

  fprintf(stderr, "Destroying mpc instance...\n");
  pgmpc_free(mpc); mpc = NULL;

  fprintf(stderr, "Done.\n");
  exit(0);
}
