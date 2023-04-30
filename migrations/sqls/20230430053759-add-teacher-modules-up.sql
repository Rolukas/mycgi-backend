/* Replace with your SQL commands */

insert into "ModuleCategory"(name, isactive) values ('Maestro', true);
insert into "Module"(name, categoryid, isactive) values ('Tomar asistencia', 6, true);
insert into "Module"(name, categoryid, isactive) values ('Registrar calificaciones', 6, true);
insert into "Module"(name, categoryid, isactive) values ('Mis grupos', 6, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (2, 11);
insert into "ProfileModule"(ProfileId, ModuleId) values (2, 12);
insert into "ProfileModule"(ProfileId, ModuleId) values (2, 13);