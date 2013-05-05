#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"

char* pgmpc_get_queue(pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return NULL;

  if(!mpd_send_list_queue_meta(this->connection)) {
    pgmpc_error("pgmpc_get_queue: command failed");
    return NULL;
  }

  cJSON* result = cJSON_CreateArray();
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

    if(artist||title||filename) {
      cJSON_AddItemToArray(result, entry);
    }
    mpd_song_free(song); song = NULL;
  }

  if(!mpd_response_finish(this->connection)) {
    pgmpc_error("pgmpc_get_queue: response failed");
    return NULL;
  }

  char* res = cJSON_Print(result);
  cJSON_Delete(result);
  return res;
}

bool pgmpc_crop (pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this)) return false;

  if (this->current_songpos < 0) return false;

  if(!mpd_run_delete_range(this->connection, 0, this->current_songpos)) {
    pgmpc_error("pgmpc_crop: delete range 1 failed");
    return false;
  }

  if (this->current_songpos < (int) this->queue_length-1) {
    if (!mpd_run_delete_range(this->connection, 1, -1)) {
      pgmpc_error("pgmpc_crop: delete range 2 failed");
      return false;
    }
  }

  return true;

}
