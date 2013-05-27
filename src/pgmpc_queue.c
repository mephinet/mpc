#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"

char* pgmpc_get_queue(pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return NULL;

  if(!mpd_send_list_queue_meta(this->connection)) {
    pgmpc_error(__func__, "command failed");
    return NULL;
  }

  cJSON* result = cJSON_CreateObject();
  cJSON_AddBoolToObject(result, "prio_support", this->prio_support);

  cJSON* songs = cJSON_CreateArray();
  cJSON_AddItemToObject(result, "songs", songs);
  struct mpd_song* song = NULL;
  while((song = mpd_recv_song(this->connection))) {

    cJSON* entry = cJSON_CreateObject();
    const char* artist = mpd_song_get_tag(song, MPD_TAG_ARTIST, 0);
    if (artist) cJSON_AddStringToObject(entry, "artist", artist);

    const char* title = mpd_song_get_tag(song, MPD_TAG_TITLE, 0);
    if (title) cJSON_AddStringToObject(entry, "title", title);

    const char* filename = mpd_song_get_uri(song);
    if (filename) cJSON_AddStringToObject(entry, "filename", filename);

    cJSON_AddNumberToObject(entry, "songid", mpd_song_get_id(song));
    cJSON_AddNumberToObject(entry, "prio", mpd_song_get_prio(song));
    cJSON_AddNumberToObject(entry, "duration", mpd_song_get_duration(song));

    if(artist||title||filename) {
      cJSON_AddItemToArray(songs, entry);
    }
    mpd_song_free(song); song = NULL;
  }

  if(!mpd_response_finish(this->connection)) {
    pgmpc_error(__func__, "response failed");
    return NULL;
  }

  char* res = cJSON_Print(result);
  cJSON_Delete(result);
  return res;
}

bool pgmpc_crop (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;

  if (this->current_songpos < 0) return false;

  if(!mpd_run_delete_range(this->connection, 0, this->current_songpos)) {
    pgmpc_error(__func__, "delete range 1 failed");
    return false;
  }

  if (this->current_songpos < (int) this->queue_length-1) {
    if (!mpd_run_delete_range(this->connection, 1, RANGE_END)) {
      pgmpc_error(__func__, "delete range 2 failed");
      return false;
    }
  }

  return true;

}
