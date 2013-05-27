#include "EXTERN.h"
#include "perl.h"
#include "XSUB.h"
#include "pgmpc.h"

typedef pgmpc* MPC;

MODULE = MPC   PACKAGE = MPC   PREFIX = pgmpc_

PROTOTYPES: DISABLE

MPC
pgmpc_new(char* package=NULL)
  CODE:
  RETVAL = pgmpc_new();
  OUTPUT:
  RETVAL

void
pgmpc_free(MPC this)

bool
pgmpc_connect(MPC this, char* host, unsigned port)

void
pgmpc_disconnect(MPC this)

bool
pgmpc_play(MPC this)

bool
pgmpc_play_by_id(MPC this, unsigned songid)

bool
pgmpc_set_song_prio(MPC this, unsigned prio, unsigned songid)

bool
pgmpc_next(MPC this)

bool
pgmpc_crop(MPC this)

bool
pgmpc_crop_to(MPC this, SV* aref)
PREINIT:
  SV** svnv = NULL;
  int* ids = NULL;
  I32 maxidx;
  I32 i;
INIT:
if((!SvROK(aref)) || (SvTYPE(SvRV(aref)) != SVt_PVAV))
    croak("parameter of crop_to is not an array reference");
CODE:
  maxidx = av_len((AV*) SvRV(aref));
  if(maxidx<0) croak("array must be non-empty");
  ids = calloc(sizeof(int*), maxidx+2);
  for(i = 0; i <= maxidx; i++) {
    svnv = av_fetch((AV*)SvRV(aref), i, false);
    if((!svnv) || (!SvIOK(*svnv))) croak("array element %d is not an integer", i);
    ids[i] = SvIV(*svnv);
  }
  ids[i] = 0;
  RETVAL = pgmpc_crop_to(this, ids);
  free(ids); ids = NULL;
OUTPUT:
  RETVAL


bool
pgmpc_stop(MPC this)

bool
pgmpc_pause(MPC this)

bool
pgmpc_set_volume(MPC this, int new)

bool
pgmpc_set_random(MPC this, bool new)

bool
pgmpc_set_repeat(MPC this, bool new)

bool
pgmpc_update_state(MPC this)

const char*
pgmpc_get_status(MPC this)

int
pgmpc_queue_version(MPC this)

const char*
pgmpc_get_queue(MPC this)

const char*
pgmpc_get_playlists(MPC this)

bool
pgmpc_load_playlist(MPC this, const char* playlist)

void pgmpc_DESTROY(MPC this)
  CODE:
  pgmpc_free(this);

const char*
pgmpc_get_error(MPC this=NULL)

void
pgmpc_clear_error(MPC this=NULL)
