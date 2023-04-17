CREATE TABLE IF NOT EXISTS "User"(
    Id SERIAL PRIMARY KEY,
    Username VARCHAR(256) NOT NULL,
    Password VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL
);

insert into "User" (username, "password", isactive) values ('admin', 'admin', true);