use Module::Build;
# See perldoc Module::Build for details of how this works

Module::Build->new
    ( module_name     => 'MPC',
      dist_abstract   => 'Music Player Client Library Wrapper',
      license         => 'perl',
      build_requires => { 'ExtUtils::CBuilder' => 0,
                          'JSON' => 0,
                        },
      extra_linker_flags => '-L../build/lib -lpgmpc',
      extra_compiler_flags => '-I../build/include -Wall -W -g -O0',
    )->create_build_script;
