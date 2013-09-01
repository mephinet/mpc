AC_INIT([mpc], [1.1.0])
AC_CONFIG_MACRO_DIR([m4])
AC_CONFIG_SRCDIR([src/pgmpc.c])
AC_CONFIG_HEADERS([config.h])

AM_INIT_AUTOMAKE([foreign])
LT_INIT([static])

AC_PROG_CC
AC_PROG_CPP
AC_PROG_INSTALL
AC_PROG_LN_S
AC_PROG_MAKE_SET

AC_CHECK_LIB([m], [floor])

AC_ARG_WITH([mpdclient],
        [AC_HELP_STRING([--with-mpdclient=PATH],
         [Path to mpdclient install base])
         ])
MPDCLIENT_PATH=$with_mpdclient
AC_SUBST([MPDCLIENT_PATH])

AC_MSG_CHECKING([for libmpdclient])
if test -r $MPDCLIENT_PATH/include/mpd/client.h
then
  AC_MSG_RESULT(yes)
else
  AC_MSG_RESULT(no)
  AC_MSG_ERROR([mpdclient not found])
fi

AC_ARG_WITH([palmpdk],
        [AC_HELP_STRING([--with-palmpdk=PATH],
         [Path to palmpdk install base])
         ])
PALMPDK=$with_palmpdk
AC_SUBST([PALMPDK])
AM_CONDITIONAL([PALMPDK], [test "$with_palmpdk"])

AC_CHECK_FUNCS([memset])
AC_CHECK_FUNCS([pow])
AC_CHECK_FUNCS([strchr])
AC_CHECK_HEADERS([float.h])
AC_CHECK_HEADERS([limits.h])
AC_CHECK_HEADERS([math.h])

AC_CONFIG_FILES([Makefile app/appinfo.json])
AC_CONFIG_SUBDIRS([libmpdclient])
AC_OUTPUT
