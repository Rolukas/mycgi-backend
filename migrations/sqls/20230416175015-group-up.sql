/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Group"(
    Id SERIAL PRIMARY KEY,
    Letter VARCHAR(1) NOT NULL,
    Level VARCHAR(1) NOT NULL,
    Fullname VARCHAR(2) NOT NULL,
 	IsActive BOOL NOT NULL
);

insert into "Group"(Letter, Level, Fullname, IsActive) values ('2', 'A', '2A', true);