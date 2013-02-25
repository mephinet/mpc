package MPC;

# $Id: MPC.pm 1041 2013-01-14 21:48:14Z philipp $

use warnings;
use strict;

require Exporter;
require DynaLoader;
our @ISA = qw(Exporter DynaLoader);
our @EXPORT = qw(init play close);

bootstrap MPC;


1;
