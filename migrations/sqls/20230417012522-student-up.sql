/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Student"(
    Id SERIAL PRIMARY KEY,
    UserId integer references "User" (Id),
    Code VARCHAR(256) NOT NULL,
    Name VARCHAR(256) NOT NULL,
    FatherLastname VARCHAR(256) NOT NULL,
    MotherLastname VARCHAR(256) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL,
    GroupId integer references "Group" (Id),
    HasPaid BOOL NOT NULL
);

insert into "User" (username, "password", isactive) values ('rolando.student@cgi.com', 'student', true);
insert into "Student"(UserId, Code, Name, FatherLastname, MotherLastname, Email, IsActive, GroupId, HasPaid) values (2, '2749631', 'Rolando', 'Student', 'Rivas', 'rolando.student@cgi.com', true, 1, true);
