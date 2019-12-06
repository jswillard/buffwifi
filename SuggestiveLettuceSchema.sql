---------------------------------------------------------------------------------------------------------------------
-- SuggestiveLettuceSchema.sql
-- Summary:
    -- This file is to hold all of the commands to build the suggestive lettuce project database schema. This will include all of the table creations, example commands, and notes for running psql command.
-- Authors: Neil Ray, Ben Prucha, Liam Nestelroad
-- Command to run: psql -h host -U username -d myDataBase -a -f myInsertFile
    -- host: IP address in which the database lives
    -- username: suggestivelettuce
    -- mydatabase: archives
    -- myInsertFile: SuggestiveLettuceSchema.sql

    -- Command for this project: psql -h host -U suggestivelettuce -d archives -a -f SuggestiveLettuceSchema.sql
-- Notes:
----------------------------------------------------------------------------------------------------------------------

-- Database Creation:
-- NOTE: while this line may not look like the typical CREATE DATABASE, it will still accomplish the same thing. The difference is that if the database is already created, it will not recreate it.
SELECT 'CREATE DATABASE suggestivelettuce' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'suggestivelettuce')\gexec

-- Table Createion:
CREATE TABLE IF NOT EXISTS speedtests(
    location TEXT,
    upload FLOAT,
    download FLOAT,
    ping FLOAT,
    time_stamp TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users(
    userID SERIAL PRIMARY KEY,
    cookie VARCHAR(20),
)

INSERT INTO speedtests (upload, download, ping, times_stamp) VALUES (50,75,15, NOW()) ON CONFLICT DO NOTHING;


INSERT INTO speedtests (upload, download, ping, time_stamp, location) VALUES (50,75,15, NOW(), 'UMC');
INSERT INTO speedtests (upload, download, ping, time_stamp, location) VALUES (43,45,5, NOW(), 'UMC');

-- These are the commands to create a new user. All of the user information here will match whats in the node.js file.

-- CREATE ROLE captain WITH LOGIN PASSWORD 'SuggestiveLettuce';
-- ALTER ROLE captain CREATEDB;
