/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Teacher"(
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(256) NOT NULL,
    Name VARCHAR(256) NOT NULL,
    FatherLastname VARCHAR(256) NOT NULL,
    MotherLastname VARCHAR(256) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL
);

insert into "Teacher"(Code, Name, FatherLastname, MotherLastname, Email, IsActive)
values ('0000', 'Juan', 'Perez', 'Martinez', 'juanperez@teacher.com', true);