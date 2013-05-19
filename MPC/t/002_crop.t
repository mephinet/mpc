#! /usr/bin/perl

# $Id$

use warnings;
use strict;

use Test::More;
use JSON;

use MPC;

my $mpc = new_ok('MPC');
ok($mpc->connect('localhost', 6600), 'call connect');

ok(my $playlists_json = $mpc->get_playlists(), 'get_playlists returns');
ok(my $playlists = decode_json($playlists_json), 'get_playlists returns valid JSON');
ok(my $playlist = $playlists->[0]->{path}, 'first playlist entry has path');

sub get_songid_at_pos {
    my $pos = shift;
    ok(my $queue_json = $mpc->get_queue(), 'get_queue returns');
    ok(my $queue = decode_json($queue_json), 'get_queue returns valid JSON');
    my $songid = $queue->{songs}->[$pos]->{songid};
}

sub check_crop {
    my $songid = shift;

    # play and crop
    ok($mpc->play_by_id($songid), 'play_by_id works');
    ok($mpc->update_state(), 'update_state returns true');
    ok($mpc->crop(), 'crop returns OK');

    # check which songid is still being played
    ok($mpc->update_state(), 'update_state returns true');
    ok(my $status_json = $mpc->get_status(), 'get_status returns');
    ok(my $status = decode_json($status_json), 'get_status returns valid JSON');
    cmp_ok($status->{songid}, '==', $songid, 'playing correct song after crop');

    # checking queue length after crop
    ok(my $queue_json = $mpc->get_queue(), 'get_queue returns');
    ok(my $queue = decode_json($queue_json), 'get_queue returns valid JSON');
    cmp_ok(@{$queue->{songs}}, '==', 1, 'queue is of length 1 after crop');

    return;
}



subtest 'crop of first song' => sub {
    ok($mpc->load_playlist($playlist), 'load first playlist');
    check_crop(get_songid_at_pos(0));
};

subtest 'crop of 3rd song' => sub {
    ok($mpc->load_playlist($playlist), 'load first playlist');
    check_crop(get_songid_at_pos(2))
};
subtest 'crop of last song' => sub {
    ok($mpc->load_playlist($playlist), 'load first playlist');
    check_crop(get_songid_at_pos(-1));
};

subtest 'double-crop' => sub {
    ok($mpc->load_playlist($playlist), 'load first playlist');
    my $id = get_songid_at_pos(2);
    check_crop($id);
    check_crop($id);
};

done_testing;
