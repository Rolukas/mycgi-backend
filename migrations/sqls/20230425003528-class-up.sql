/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Class"(
    Id SERIAL PRIMARY KEY,
    IsActive BOOL NOT NULL,
    SubjectId integer references "Subject" (Id),
    TeacherId integer references "Teacher" (Id),
    StartHour VARCHAR(10) NOT NULL,
    EndHour VARCHAR(10) NOT NULL
);

-- Classes
insert into "ModuleCategory"(name, isactive) values ('Clases', true);
insert into "Module"(name, categoryid, isactive) values ('Clases', 5, true);
insert into "Module"(name, categoryid, isactive) values ('Agregar Clase', 5, true);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 9);
insert into "ProfileModule"(ProfileId, ModuleId) values (1, 10);

insert into "Class"(IsActive, SubjectId, TeacherId, StartHour, EndHour)
values (true, 1, 1, '9:00', '10:00');

-- StudentClass
CREATE TABLE IF NOT EXISTS "StudentClass"(
    Id SERIAL PRIMARY KEY,
    StudentId integer references "Student" (Id),
    ClassId integer references "Class" (Id)
);

insert into "StudentClass"(StudentId, ClassId)
values (1, 1);
