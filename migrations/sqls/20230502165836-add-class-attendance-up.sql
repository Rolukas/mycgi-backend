/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Attendance"(
    Id SERIAL PRIMARY KEY,
    Date DATE NOT NULL,
    ClassId integer references "Class" (Id),
    StudentId integer references "Student" (Id),
    IsAttendance BOOL NOT NULL,
    IsActive BOOL NOT NULL
);