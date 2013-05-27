#include <stdlib.h>
#include <string.h>
#include <stdio.h>

#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"
#include "syslog.h"

const unsigned timeout = 0;
static char* err_str = NULL;

static bool pgmpc_reconnect(pgmpc*);
static bool _pgmpc_check_and_reconnect(pgmpc*, const char*, bool);

pgmpc* pgmpc_new() {
  pgmpc* self = calloc (1, sizeof (pgmpc));
  if(!self) {
    pgmpc_error(__func__, "pgmpc_new: calloc failed");
    return NULL;
  }

  return self;
}

void pgmpc_free(pgmpc* this) {
  if(this->connection) {
    mpd_connection_free(this->connection);
    this->connection = NULL;
  }

  pgmpc_free_state(this);

  free(this);
  this = NULL;
}

void pgmpc_free_state(pgmpc* this) {
  if(this->current_artist) {
    free(this->current_artist);
    this->current_artist = NULL;
  }

  if(this->current_title) {
    free(this->current_title);
    this->current_title = NULL;
  }

  if(this->current_filename) {
    free(this->current_filename);
    this->current_filename = NULL;
  }
}

bool pgmpc_connect(pgmpc* this, const char* host, unsigned port) {
  this->host = strdup(host);
  this->port = port;
  return pgmpc_reconnect(this);
}

static bool pgmpc_reconnect(pgmpc* this) {
  this->connection   = mpd_connection_new(this->host, this->port, timeout);
  this->prio_support = (mpd_connection_cmp_server_version(this->connection, 0, 17, 0) >= 0);
  return pgmpc_check_and_reconnect(this, __func__);
}

bool pgmpc_play (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_play(this->connection), __func__);
}

bool pgmpc_play_by_id (pgmpc* this, unsigned songid) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_play_id(this->connection, songid), __func__);
}

bool pgmpc_set_song_prio (pgmpc* this, unsigned prio, unsigned songid) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_prio_id(this->connection, prio, songid), __func__);
}

bool pgmpc_pause (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_pause(this->connection, true), __func__);
}

bool pgmpc_stop (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_stop(this->connection), __func__);
}

bool pgmpc_next (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_next(this->connection), __func__);
}

bool pgmpc_set_volume(pgmpc* this, unsigned int new) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_set_volume(this->connection, new), __func__);
}

bool pgmpc_set_random(pgmpc* this, bool new) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_random(this->connection, new), __func__);
}

bool pgmpc_set_repeat(pgmpc* this, bool new) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  return pgmpc_check(this, mpd_run_repeat(this->connection, new), __func__);
}

bool pgmpc_crop_to(pgmpc* this, int* ids) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;

  // remove all ids
  mpd_command_list_begin(this->connection, false);
  unsigned i;
  for (i=0; ids[i]>0; i++) {
    mpd_send_move_id(this->connection, ids[i], i);
  }

  mpd_send_delete_range(this->connection, i, (unsigned) -1);
  mpd_command_list_end(this->connection);
  mpd_response_finish(this->connection);

  return true;
}

void pgmpc_disconnect (pgmpc* this) {
  if(this->connection) {
    mpd_connection_free(this->connection);
    this->connection = NULL;
  }

  if(this->host) {
    free(this->host);
    this->host = NULL;
  }
  this->port = 0;
  this->state = NULL;

  pgmpc_free_state(this);
  return;
}

void pgmpc_error (const char* func, const char* err) {
  syslog(LOG_ERR, "%s: %s", func, err);
  err_str = malloc(strlen(func) + 2 + strlen(err) + 1);
  sprintf(err_str, "%s: %s", func, err);
}

const char* pgmpc_get_error() {
  return err_str;
}

void pgmpc_clear_error() {
  free(err_str); err_str = NULL;
}

bool pgmpc_check_and_reconnect(pgmpc* this, const char* func) {
  return _pgmpc_check_and_reconnect(this, func, 1);
}

bool pgmpc_check(pgmpc* this, bool result, const char* func) {
  if(!result) {
    enum mpd_error error = mpd_connection_get_error(this->connection);
    const char* s = "unknown error";
    if (error != MPD_ERROR_SUCCESS) {
      s = mpd_connection_get_error_message(this->connection);
    }
    pgmpc_error(func, s);
  }
  return result;
}


static bool _pgmpc_check_and_reconnect(pgmpc* this, const char* func, bool retry) {
  if (!this->connection) {
    pgmpc_error(func, "no connection");
    return false;
  }
  enum mpd_error err = mpd_connection_get_error(this->connection);
  if (err == MPD_ERROR_SUCCESS) return true;

  if (retry && (err == MPD_ERROR_TIMEOUT || err == MPD_ERROR_CLOSED)) {
    pgmpc_error(func, mpd_connection_get_error_message(this->connection));
    pgmpc_reconnect(this);
    return _pgmpc_check_and_reconnect(this, func, 0);
  }
  pgmpc_error(func, mpd_connection_get_error_message(this->connection));
  return false;
}
