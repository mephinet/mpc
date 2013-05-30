#ifndef MPC_H
#define MPC_H

#include <stdbool.h>

struct pgmpc_t;
typedef struct pgmpc_t pgmpc;

pgmpc* pgmpc_new();
void pgmpc_free(pgmpc*);

bool pgmpc_connect(pgmpc*, const char*, unsigned);
void pgmpc_disconnect(pgmpc*);

bool pgmpc_play(pgmpc*);
bool pgmpc_play_by_id(pgmpc*, unsigned);
bool pgmpc_set_song_prio(pgmpc*, unsigned prio, unsigned songid);
bool pgmpc_pause(pgmpc*);
bool pgmpc_stop(pgmpc*);
bool pgmpc_next(pgmpc*);
bool pgmpc_crop(pgmpc*);
bool pgmpc_reduce_queue(pgmpc*, int*);

bool pgmpc_set_volume(pgmpc*, unsigned int);
bool pgmpc_set_random(pgmpc*, bool);
bool pgmpc_set_repeat(pgmpc*, bool);

bool pgmpc_update_state(pgmpc*);
// these methods act on this (updated) state
char* pgmpc_get_status(pgmpc*);
unsigned int pgmpc_queue_version(pgmpc*);

char* pgmpc_get_queue(pgmpc*);

char* pgmpc_get_playlists(pgmpc*);
bool pgmpc_load_playlist(pgmpc*, const char*);

const char* pgmpc_get_error();
void pgmpc_clear_error();

#endif
