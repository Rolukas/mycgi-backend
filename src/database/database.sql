-- Create users

 CREATE TABLE Usuario(

   UsuarioId INT NOT NULL GENERATED ALWAYS AS IDENTITY,
   Usuario VARCHAR(256) NOT NULL,
   Password VARCHAR(256) NOT NULL,
   Nombre  VARCHAR(256) NOT NULL,
   Telefono VARCHAR(256) NOT NULL,
   Correo VARCHAR(256) NOT NULL,
   FechaRegistro date NOT NULL DEFAULT CURRENT_DATE,
   Activo BOOL NOT NULL DEFAULT (true),

   PRIMARY KEY (UsuarioId)
 )

 -- INSERT DATA
 INSERT INTO usuario(USUARIO, PASSWORD, NOMBRE, TELEFONO, CORREO, activo) VALUES ('talent', 'land', 'TalentHackathon', '3321236934', 'rolandosumoza@gmail.com', true)
 