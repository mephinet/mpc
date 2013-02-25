#include <stdlib.h>
#include <string.h>

#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"
#include "syslog.h"

const unsigned timeout = 0;
static const char* err_str = NULL;

static bool pgmpc_reconnect(pgmpc*);
static bool _pgmpc_check_and_reconnect(pgmpc*, bool);

pgmpc* pgmpc_new() {
  pgmpc* self = calloc (1, sizeof (pgmpc));
  if(!self) {
    pgmpc_error("pgmpc_new: calloc failed");
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
  this->connection = mpd_connection_new(this->host, this->port, timeout);
  return pgmpc_check_and_reconnect(this);
}

bool pgmpc_play (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_play(this->connection);
}

bool pgmpc_play_by_id (pgmpc* this, unsigned songid) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_play_id(this->connection, songid);
}

bool pgmpc_pause (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_pause(this->connection, true);
}

bool pgmpc_stop (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_stop(this->connection);
}

bool pgmpc_next (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_next(this->connection);
}

bool pgmpc_set_volume(pgmpc* this, unsigned int new) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_set_volume(this->connection, new);
}

bool pgmpc_set_random(pgmpc* this, bool new) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_random(this->connection, new);
}

bool pgmpc_set_repeat(pgmpc* this, bool new) {
  if(!pgmpc_check_and_reconnect(this)) return false;
  return mpd_run_repeat(this->connection, new);
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

void pgmpc_error (const char* err) {
  syslog(LOG_ERR, "%s", err);
  err_str = err;
}

const char* pgmpc_get_error() {
  return err_str;
}

void pgmpc_clear_error() {
  err_str = NULL;
}

bool pgmpc_check_and_reconnect(pgmpc* this) {
  return _pgmpc_check_and_reconnect(this, 1);
}

static bool _pgmpc_check_and_reconnect(pgmpc* this, bool retry) {
  if (!this->connection) {
    pgmpc_error("no connection");
    return false;
  }
  enum mpd_error err = mpd_connection_get_error(this->connection);
  if (err == MPD_ERROR_SUCCESS) return true;

  if (retry && (err == MPD_ERROR_TIMEOUT || err == MPD_ERROR_CLOSED)) {
    pgmpc_error(mpd_connection_get_error_message(this->connection));
    pgmpc_reconnect(this);
    return _pgmpc_check_and_reconnect(this, 0);
  }
  pgmpc_error(mpd_connection_get_error_message(this->connection));
  return false;
}
