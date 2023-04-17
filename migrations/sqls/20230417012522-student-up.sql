/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Student"(
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(256) NOT NULL,
    Name VARCHAR(256) NOT NULL,
    FatherLastname VARCHAR(256) NOT NULL,
    MotherLastname VARCHAR(256) NOT NULL,
    Email VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL,
    GroupId integer references "Group" (Id),
    HasPaid BOOL NOT NULL
);

insert into "Student"(Code, Name, FatherLastname, MotherLastname, Email, IsActive, GroupId, HasPaid) values ('2749631', 'Juan', 'Perez', 'Martinez', 'admin@admin.com', true, 1, true);
