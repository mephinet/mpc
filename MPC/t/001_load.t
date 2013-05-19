# -*- perl -*-

use Test::More;
use JSON;

use MPC;

use warnings;
use strict;

sub get_status {
    my $mpc = shift;
    ok($mpc->update_state(), 'update_state returns true');

    ok(my $status_json = $mpc->get_status(), 'get_status returns');
    ok(my $status = decode_json($status_json), 'get_status returns valid JSON');

    return $status;
}

sub get_state {
    my $mpc = shift;
    my $status = get_status($mpc);
    return $status->{state};
}

my $mpc = new_ok('MPC');

ok($mpc->play() == 0, 'call play without init');
like(MPC::get_error(), qr/no conn/, 'correct error message from class');
MPC::clear_error();
ok(!MPC::get_error(), 'clear_error worked on class');

ok($mpc->play() == 0, 'call play (again) without init');
like($mpc->get_error(), qr/no conn/, 'correct error message from instance');
$mpc->clear_error();
ok(!$mpc->get_error(), 'clear_error worked on instance');

ok($mpc->connect('localhost', 6600), 'call connect');

ok(my $playlists_json = $mpc->get_playlists(), 'get_playlists returns');
ok(my $playlists = decode_json($playlists_json), 'get_playlists returns valid JSON');
ok(my $playlist = $playlists->[0]->{path}, 'first playlist entry has path');
ok($mpc->load_playlist($playlist), 'load first playlist');

ok($mpc->play(), 'call play');
is(get_state($mpc), 'play', 'correct state after play');

ok($mpc->next(), 'call next');
is(get_state($mpc), 'play', 'correct state after next');

ok($mpc->pause(), 'call pause');
is(get_state($mpc), 'pause', 'correct state after pause');

ok($mpc->play(), 'call play');
is(get_state($mpc), 'play', 'correct state after play');

ok($mpc->set_volume(10), 'ok setting volume');

ok($mpc->update_state(), 'update_state returns true');

ok(my $status_json = $mpc->get_status(), 'get_status returns');
ok(my $status = decode_json($status_json), 'get_status returns valid JSON');

like($status->{artist}, qr/\w+/, 'artist info returned');
like($status->{title}, qr/\w+/, 'title info returned');
like($status->{filename}, qr/\w+/, 'filename info returned');
is($status->{volume}, 10, 'set_volume worked');
ok($mpc->queue_version() > 0, 'get_status sets queue_version');

ok(my $queue_json = $mpc->get_queue(), 'get_queue returns');
ok(my $queue = decode_json($queue_json), 'get_queue returns valid JSON');
is(ref($queue), 'HASH', 'get_queue returns a hash');
ok(my $songs = $queue->{songs}, 'queue contains songs');

is(ref($songs), 'ARRAY', 'songs is an array');
ok($songs->[0]->{artist} || $songs->[0]->{title} || $songs->[0]->{filename}, 'queue entry is non-empty');

my $songid = $songs->[0]->{songid};
like($songid, qr/^\d+$/, "valid ID");
ok($mpc->play_by_id($songid), "play_by_id works");

ok($mpc->set_random(0), 'set random to false');
ok(!get_status($mpc)->{random}, 'setting random to false worked');
ok($mpc->set_random(1), 'set random to true');
ok(get_status($mpc)->{random}, 'setting random to true worked');
ok($mpc->set_random(0), 'set random to false');
ok(!get_status($mpc)->{random}, 'setting random to false worked again');

ok($mpc->set_repeat(0), 'set repeat to false');
ok(!get_status($mpc)->{repeat}, 'setting repeat to false worked');
ok($mpc->set_repeat(1), 'set repeat to true');
ok(get_status($mpc)->{repeat}, 'setting repeat to true worked');
ok($mpc->set_repeat(0), 'set repeat to false');
ok(!get_status($mpc)->{repeat}, 'setting repeat to false worked again');

ok($mpc->stop(), 'call stop');
is(get_state($mpc), 'stop', 'correct state after stop');
ok(!$mpc->disconnect(), 'call disconnect');

done_testing;
