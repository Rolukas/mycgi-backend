/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Teacher"(
    Id SERIAL PRIMARY KEY,
    UserId integer references "User" (Id),
    Code VARCHAR(256) NOT NULL,
    Name VARCHAR(256) NOT NULL,
    FatherLastname VARCHAR(256) NOT NULL,
    MotherLastname VARCHAR(256) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL
);


insert into "User" (username, "password", isactive) values ('rolando.teacher@cgi.com', 'teacher', true);
insert into "Teacher"(UserId, Code, Name, FatherLastname, MotherLastname, Email, IsActive)
values (3, '0000', 'Rolando', 'Teacher', 'Rivas', 'rolando.teacher@cgi.com', true);