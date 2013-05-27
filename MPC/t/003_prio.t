#! /usr/bin/perl

# $Id$

use warnings;
use strict;

use Test::More;
use JSON;

use MPC;

my $mpc = new_ok('MPC');
ok($mpc->connect('localhost', 6600), 'call connect');

ok(my $queue_json = $mpc->get_queue(), 'get_queue successful');
ok(my $queue = decode_json($queue_json), 'get_queue returned valid JSON');
ok(exists $queue->{prio_support}, 'get_queue returns prio_support');

SKIP: {
    if (!$queue->{prio_support}) {
        skip "prio tests as server does not support prioid command", 1;
    }

    my $songid = $queue->{songs}->[0]->{songid};
    ok($mpc->set_song_prio(1, $songid), "set_song_prio returned true");
}

done_testing;
