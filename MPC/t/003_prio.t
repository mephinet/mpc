#! /usr/bin/perl

# $Id$

use warnings;
use strict;

use Test::More;
use JSON;

use MPC;

my $mpc = new_ok('MPC');
ok($mpc->connect('localhost', 6600), 'call connect');

my $res = $mpc->set_song_prio(1, 2);

SKIP: {
    if (!$res and $mpc->get_error() =~ /unknown command/) {
        skip "prio tests as server does not support prioid command", 1;
    }

    ok($res, "set_song_prio returned true");

}

done_testing;
