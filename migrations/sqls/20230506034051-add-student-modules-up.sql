/* Replace with your SQL commands */

insert into "ModuleCategory"(name, isactive) values ('Alumno', true);
insert into "Module"(name, categoryid, isactive) values ('Mis clases', 7, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (3, 14);