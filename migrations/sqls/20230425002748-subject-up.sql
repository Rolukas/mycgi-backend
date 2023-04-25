/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Subject"(
    Id SERIAL PRIMARY KEY,
    Code VARCHAR(256) NOT NULL,
    Name VARCHAR(256) NOT NULL,
    IsActive BOOL NOT NULL
);

-- Materias
insert into "ModuleCategory"(name, isactive) values ('Materias', true);
insert into "Module"(name, categoryid, isactive) values ('Materias', 4, true);
insert into "Module"(name, categoryid, isactive) values ('Agregar Materia', 4, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 7);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 8);

insert into "Subject"(Code, Name, IsActive)
values ('0000', 'Cocina Mexicana', true);