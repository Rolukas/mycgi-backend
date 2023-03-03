// Modules
const router = require("../routes");
const Authorize = require('../functions/auth');

// DB connection
const pool = require('../database/db_connect');

const onLogin = async(req, res) => {

    try{

        let authorization = req.headers.authorization;
        //  console.log(authorization)
        let userpass = authorization.split(' ')[1];
        //let decodedAuth = ecrypt.decryptor(userpass);
        let plainText = Buffer.from(userpass, 'base64').toString('ascii');

        // Credentials
        let req_username = plainText.split(':')[0]; // Username filled by user

        //Authorize
        let auth = await Authorize(req);
        if(!auth.isAuthorized){
            res.status(401).send({success: false, message: auth.message });
            return false;
        }

        // CHECAR USUARIO ID
        var response;
        var request = await pool.query(`SELECT UsuarioId FROM Usuario WHERE usuario = '${req_username}'`);

        if(request.rowCount == 0){
            response = {
                success: true,
                items: request.rows,
                message: 'no user was found'
            }
            res.send(response);
            return false;
        }

        // CHECAR USUARIO PERFIL
        var userId = request.rows[0].usuarioid;
        request = await pool.query(`SELECT * FROM UsuarioPerfil WHERE UsuarioId = ${userId}`);

        if(request.rowCount == 0){
            response = {
                success: true,
                items: [{ usuarioid: userId }],
                message: 'user without profile'
            }
            res.send(response);
            return false;
        }

        request = await pool.query(`SELECT U.usuarioid, U.nombre, up.perfilid FROM Usuario AS u
        JOIN UsuarioPerfil AS up ON up.usuarioid = u.usuarioid
        JOIN Perfil AS p ON p.perfilid = up.perfilid
        WHERE u.usuarioid = ${userId}`);

        if(request.rowCount == 0){
            response = {
                success: false,
                items: [],
                message: 'cannot get user information'
            }
            res.send(response);
            return false;
        }

        let userInfo = request.rows[0];

        request = await pool.query(`SELECT
        M.moduloid, M.ruta,
        M.descripcion FROM usuario as U
        JOIN usuarioperfil as UP on U.usuarioid = UP.usuarioid
        JOIN perfil as P on UP.PerfilId = P.perfilid
        JOIN ModuloPerfil as MP on MP.perfilId = P.perfilId
        JOIN Modulo as M on MP.moduloId = M.moduloId
        where u.usuarioid = '${userId}'`);

        if(request.rowCount == 0){
            response = {
                success: false,
                items: [],
                message: 'cannot get modules'
            }
            res.send(response);
            return false;
        }

        response = {
            success: true,
            items: {
                userInfo,
                modules: request.rows
            },
            message: 'login succesfull'
        }

        res.send(response);

    } catch(error){
        console.log("ERROR")
        res.status(401).send({success: false, message: error.toString() });
    }

};

module.exports = {
    onLogin
};