#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"
#include <string.h>
#include <stdlib.h>

bool pgmpc_update_state(pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;

  if (this->current_artist) {
    free(this->current_artist); this->current_artist = NULL;
  }
  if (this->current_title) {
    free(this->current_title); this->current_title = NULL;
  }
  if (this->current_filename) {
    free(this->current_filename); this->current_filename = NULL;
  }

  struct mpd_song* song = mpd_run_current_song(this->connection);
  if (song) {
    const char * tmp;
    if ((tmp = mpd_song_get_tag(song, MPD_TAG_ARTIST, 0))) {
      this->current_artist = strdup(tmp);
    }

    if ((tmp = mpd_song_get_tag(song, MPD_TAG_TITLE, 0))) {
      this->current_title = strdup(tmp);
    }

    if ((tmp = mpd_song_get_uri(song))) {
      this->current_filename = strdup(tmp);
    }

    mpd_song_free(song); song = NULL;
  }

  // volume
  struct mpd_status* status = mpd_run_status(this->connection);
  if(!status) {
    pgmpc_error(__func__, "failed getting current status");
    return false;
  }

  this->current_volume  = mpd_status_get_volume(status);
  this->current_songid  = mpd_status_get_song_id(status);
  this->current_songpos = mpd_status_get_song_pos(status);
  this->queue_version   = mpd_status_get_queue_version(status);
  this->queue_length    = mpd_status_get_queue_length(status);
  this->elapsed_time    = mpd_status_get_elapsed_time(status);
  this->total_time      = mpd_status_get_total_time(status);
  this->random          = mpd_status_get_random(status);
  this->repeat          = mpd_status_get_repeat(status);
  switch (mpd_status_get_state(status)) {
  case MPD_STATE_PLAY:
    this->state = "play";
    break;
  case MPD_STATE_STOP:
    this->state = "stop";
    break;
  case MPD_STATE_PAUSE:
    this->state = "pause";
    break;
  default:
    this->state = "?";
  }

  mpd_status_free(status); status = NULL;

  return true;
}


char* pgmpc_get_status(pgmpc* this) {
  cJSON* root = cJSON_CreateObject();
  if(!root) {
    pgmpc_error(__func__, "failed allocating cJSON object");
    return NULL;
  }

  cJSON_AddNumberToObject(root, "volume", this->current_volume);

  if (this->current_artist) cJSON_AddStringToObject(root, "artist", this->current_artist);
  if (this->current_title) cJSON_AddStringToObject(root, "title", this->current_title);
  if (this->current_filename) cJSON_AddStringToObject(root, "filename", this->current_filename);
  if (this->current_songid >=0) cJSON_AddNumberToObject(root, "songid", this->current_songid);
  cJSON_AddNumberToObject(root, "elapsed_time", this->elapsed_time);
  cJSON_AddNumberToObject(root, "total_time", this->total_time);
  cJSON_AddBoolToObject(root, "random", this->random);
  cJSON_AddBoolToObject(root, "repeat", this->repeat);

  if (this->state) cJSON_AddStringToObject(root, "state", this->state);
  char* res = cJSON_Print(root);
  cJSON_Delete(root);
  return res;
}

unsigned int pgmpc_queue_version(pgmpc* this) {
  return this->queue_version;
}
