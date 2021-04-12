\echo 'Delete and recreate waveServer db?'

CREATE DATABASE waveserver;
\connect waveserver

\i waveserver-schema.sql
\i waveserver-seed.sql

\echo 'Delete and recreate waveserver_test db?'
\prompt 'Return for yes or control-C to cancel > ' foo
 
DROP DATABASE waveserver_test;
CREATE DATABASE waveserver_test;
\connect waveserver_test

\i waveserver-schema.sql
