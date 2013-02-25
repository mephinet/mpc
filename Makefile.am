ACLOCAL_AMFLAGS= -I m4
AM_CPPFLAGS = -I include -I $(MPDCLIENT_PATH)/include
AM_CFLAGS = -Wall -W -Werror -Wno-attributes

lib_LTLIBRARIES = libpgmpc.la
libpgmpc_la_SOURCES = include/pgmpc.h include/pgmpc_internals.h \
	src/pgmpc.c src/pgmpc_status.c src/pgmpc_queue.c src/pgmpc_playlists.c \
	cjson/cJSON.h cjson/cJSON.c
libpgmpc_la_LIBADD = $(MPDCLIENT_PATH)/src/libmpdclient.la
include_HEADERS = include/pgmpc.h

bin_PROGRAMS = mpc_start_stop
if PALMPDK
  bin_PROGRAMS += mpc_plugin
endif

mpc_start_stop_SOURCES = src/mpc_start_stop.c
mpc_start_stop_LDADD = libpgmpc.la

mpc_plugin_SOURCES = src/mpc_plugin.h src/mpc_plugin.c \
	src/mpc_callbacks.h src/mpc_callbacks.c \
	src/mpc_timers.h src/mpc_timers.c 

mpc_plugin_CPPFLAGS = $(AM_CPPFLAGS) -I $(PALMPDK)/include/ -I $(PALMPDK)/include/SDL/ -I $(PALMPDK)/arm-gcc/sysroot/usr/include/
mpc_plugin_LDADD = libpgmpc.la -lpdl -lSDL
mpc_plugin_LDFLAGS = -L$(PALMPDK)/device/lib
