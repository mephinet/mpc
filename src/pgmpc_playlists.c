#include "pgmpc.h"
#include "pgmpc_internals.h"
#include "cjson/cJSON.h"

char* pgmpc_get_playlists(pgmpc* this) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return NULL;

  if(!mpd_send_list_playlists(this->connection)) {
    pgmpc_error(__func__, "command failed");
    return NULL;
  }

  cJSON* result = cJSON_CreateArray();

  struct mpd_playlist* playlist;
  while((playlist = mpd_recv_playlist(this->connection))) {
    cJSON* entry = cJSON_CreateObject();

    const char* path = mpd_playlist_get_path(playlist);
    if (path) {
      cJSON_AddStringToObject(entry, "path", path);
      cJSON_AddItemToArray(result, entry);
    }

    mpd_playlist_free(playlist); playlist = NULL;
  }

  if(!mpd_response_finish(this->connection)) {
    pgmpc_error(__func__, "response failed");
    return NULL;
  }

  char* res = cJSON_Print(result);
  cJSON_Delete(result);
  return res;
}

bool pgmpc_load_playlist(pgmpc* this, const char* playlist) {
  if(!pgmpc_check_and_reconnect(this, __func__)) return false;
  pgmpc_free_state(this);
  return pgmpc_check(this, (mpd_run_clear(this->connection) && mpd_run_load(this->connection, playlist)), __func__);
}
