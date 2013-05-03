#! /bin/sh

set -e

TARGET=${1:-host}

if [[ "$TARGET" == "device" ]]
then
    : ${PALMPDK:=/opt/PalmPDK}
    PATH=$PALMPDK/arm-gcc/bin/:$PATH
    CONFIGURE_OPTS="--host=arm-none-linux-gnueabi --enable-static --disable-shared --with-sysroot=$PALMPDK/arm-gcc/sysroot --with-palmpdk=$PALMPDK"
    INSTALL_TARGET=install-strip
elif [[ "$TARGET" == "host" ]]
then
    INSTALL_TARGET=install
else
    echo "Usage: $0 (device|host)"
    exit 1
fi


BASE=$PWD
BUILDDIR=$BASE/build

[[ -d $BUILDDIR ]] && rm -rf $BUILDDIR

[[ -d libmpdclient ]] || git clone git://git.musicpd.org/master/libmpdclient.git/

cd libmpdclient
[[ "$QUICK" ]] || git fetch
[[ "$QUICK" ]] || git checkout release-2.8
[[ "$QUICK" ]] || NOCONFIGURE=1 ./autogen.sh --prefix=$BUILDDIR
cd ..

[[ -d cjson ]] || svn co https://cjson.svn.sourceforge.net/svnroot/cjson cjson
[[ "$QUICK" ]] || svn up cjson

[[ "$QUICK" ]] || libtoolize --force
[[ "$QUICK" ]] || aclocal -I m4
[[ "$QUICK" ]] || autoconf
[[ "$QUICK" ]] || autoheader
[[ "$QUICK" ]] || automake --add-missing
if [[ "$QUICK" ]]
then
    ./config.status
else
    ./configure --with-mpdclient=libmpdclient --prefix=$BUILDDIR $CONFIGURE_OPTS
fi

[[ "$QUICK" ]] || make -C libmpdclient clean
make -C libmpdclient all $INSTALL_TARGET
[[ "$QUICK" ]] || make clean
make all $INSTALL_TARGET

if [[ "$TARGET" == "host" ]]
then
    export LD_LIBRARY_PATH=$BUILDDIR/lib:$LD_LIBRARY_PATH
    cd MPC
    export PERL_MB_OPT=
    perl Build.PL --install_base $BUILDDIR
    [[ "$NOCLEAN" ]] || ./Build clean
    ./Build build
    LD_LIBRARY_PATH=$PWD/blib/arch/auto/MPC:$LD_LIBRARY_PATH ./Build test
elif [[ "$TARGET" == "device" ]]
then
    cp -p $BUILDDIR/bin/mpc_plugin app/
    find app \( -name "*~" -or -name "*.rej" -or -name "*.orig" -or -name "*.bak" -or -name ".#*" -or -name "*.tmp" -or -name "#*" \) -delete
    palm-package -o $BUILDDIR --exclude="*.sh" --exclude="*.in" app
    IPK=$(ls $BUILDDIR/*.ipk)
    APP=$(basename $IPK | cut -d _ -f 1)
    palm-install $IPK
    palm-launch $APP
    palm-log --system-log-level info
    palm-log -f $APP
    palm-log --system-log-level error
fi
