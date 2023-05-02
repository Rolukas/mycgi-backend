/* Replace with your SQL commands */

CREATE TABLE IF NOT EXISTS "Week"(
    Id SERIAL PRIMARY KEY,
    Number integer NOT NULL,
    ClassId integer references "Class" (Id),
    IsLocked BOOL NOT NULL,
    IsActive BOOL NOT NULL
);

INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (1, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (2, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (3, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (4, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (5, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (6, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (7, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (8, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (9, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (10, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (11, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (12, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (13, 1, false, true);
INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (14, 1, false, true);

