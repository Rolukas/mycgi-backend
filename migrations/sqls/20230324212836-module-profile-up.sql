CREATE TABLE IF NOT EXISTS "Profile"(
    Id SERIAL PRIMARY KEY,
    Name VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS "UserProfile"(
    Id SERIAL PRIMARY KEY,
 	UserId integer references "User" (Id),
 	ProfileId integer references "Profile" (Id)
);

CREATE TABLE IF NOT EXISTS "ModuleCategory"(
    Id SERIAL PRIMARY KEY,
 	Name VARCHAR(256) NOT NULL,
 	IsActive BOOL NOT NULL
); 

CREATE TABLE IF NOT EXISTS "Module"(
    Id SERIAL PRIMARY KEY,
 	Name VARCHAR(256) NOT NULL,
    CategoryId integer references "ModuleCategory" (Id),
 	IsActive BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS "ProfileModule"(
    Id SERIAL PRIMARY KEY,
 	ProfileId integer references "Profile" (Id),
    ModuleId integer references "Module" (Id)
);

-- Perfiles
insert into "Profile"(Name, IsActive) values ('Directivo', true);
insert into "Profile"(Name, IsActive) values ('Maestro', true);
insert into "Profile"(Name, IsActive) values ('Alumno', true);

insert into "UserProfile"(UserId, ProfileId) values (1, 1);
-- Alumnos
insert into "ModuleCategory"(Name, IsActive) values ('Alumnos', true);
insert into "Module"(Name, CategoryId, IsActive) values ('Alumnos', 1, true);
insert into "Module"(name, categoryid, isactive) values ('Agregar Alumno', 1, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 1);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 2);
-- Maestros
insert into "ModuleCategory"(name, isactive) values ('Maestros', true);
insert into "Module"(name, categoryid, isactive) values ('Maestros', 2, true);
insert into "Module"(name, categoryid, isactive) values ('Agregar Maestro', 2, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 3);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 4);
-- Grupos
insert into "ModuleCategory"(name, isactive) values ('Grupos', true);
insert into "Module"(name, categoryid, isactive) values ('Grupos', 3, true);
insert into "Module"(name, categoryid, isactive) values ('Agregar Grupo', 3, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 5);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 6);

