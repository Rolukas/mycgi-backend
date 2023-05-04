/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "GradeCriteria"(
    Id SERIAL PRIMARY KEY,
    Name Varchar(256) NOT NULL,
    MinValue integer NOT NULL,
    MaxValue integer NOT NULL,
    IsActive BOOL NOT NULL
);

-- Insert criteria
insert into "GradeCriteria" (Name, MinValue, MaxValue, IsActive) 
VALUES ('Uniforme y presentación', 0, 5, true);

insert into "GradeCriteria" (Name, MinValue, MaxValue, IsActive) 
VALUES ('Limpieza y orden', 0, 5, true);

insert into "GradeCriteria" (Name, MinValue, MaxValue, IsActive) 
VALUES ('Dominio de métodos', 0, 5, true);

insert into "GradeCriteria" (Name, MinValue, MaxValue, IsActive) 
VALUES ('Colaboración e iniciativa', 0, 5, true);

CREATE TABLE IF NOT EXISTS "WeekRangePonderation"(
    Id SERIAL PRIMARY KEY,
    StartWeek integer NOT NULL, -- 1
    EndWeek integer NOT NULL, -- 6
    Percentage numeric NOT NULL -- 30
);

insert into "WeekRangePonderation" (StartWeek, EndWeek, Percentage)
VALUES (1, 6, 30);

insert into "WeekRangePonderation" (StartWeek, EndWeek, Percentage)
VALUES (7, 12, 30);

insert into "WeekRangePonderation" (StartWeek, EndWeek, Percentage)
VALUES (13, 13, 40);

insert into "WeekRangePonderation" (StartWeek, EndWeek, Percentage)
VALUES (14, 14, 0);

CREATE TABLE IF NOT EXISTS "GradeWeek"(
    Id SERIAL PRIMARY KEY,
    WeekId integer references "Week" (Id),
    ClassId integer references "Class" (Id),
    StudentId integer references "Student" (Id),
    CriteriaId integer references "GradeCriteria" (Id),
    Score numeric NOT NULL
);

