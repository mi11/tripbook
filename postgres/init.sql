CREATE USER admin with encrypted password 'password';
CREATE DATABASE main;
GRANT ALL PRIVILEGES ON DATABASE main TO admin;

CREATE USER test with encrypted password 'password';
CREATE DATABASE test;
GRANT ALL PRIVILEGES ON DATABASE test TO test;