/* Replace with your SQL commands */

alter table "Class" add column days varchar(100) default '';
update "Class" set days = 'L,M,Mi,J,V';
update "Module" set Name = 'Mis clases' where Id = 13;