const Authorize = require('../functions/auth');

// DB connection
const pool = require('../database/db_connect');
const { response, request } = require("express");

const onCreateUser = async(req, res)=> {
    try{

        // //Authorize
        // let auth = await Authorize(req);
        // if(!auth.isAuthorized){
        //     res.status(401).send({success: false, message: auth.message });
        //     return false;
        // }

        let data = req.body;
        let response;

        const requestExistentUser = await pool.query(`SELECT usuario FROM Usuario WHERE usuario = '${data.user}'`);

        if(requestExistentUser.rowCount > 0){
            response = {
                success: false,
                items: [],
                message: 'user already created'
            };

            res.send(response);
            return false;
        }

        const request = await pool.query(
            `INSERT INTO usuario(usuario, password, nombre, telefono, correo, activo)
            VALUES('${data.user}', '${data.pass}', '${data.name}', '${data.num}', '${data.email}', true) RETURNING *`
        );

        console.log(request)

        if(request.rowCount > 0){
            response = {
                success: true,
                items: request.rows,
                message: 'user created succesfully'
            };
        }else{
            response = {
                success: false,
                items: [],
                message: 'cannot create user'
            };
        };
        

        res.send(response);

    } catch(error){
        console.log("ERROR")
        res.status(500).send({ success: false, message: error.toString() });
    }
}

const onUpdateUser = async(req, res)=> {
    try{

        //Authorize
        let auth = await Authorize(req);
        if(!auth.isAuthorized){
            res.status(401).send({success: false, message: auth.message });
            return false;
        }

        let data = req.body;

        const request = await pool.query(
            `UPDATE usuario SET usuario = '${data.user}', password = '${data.pass}', nombre = '${data.name}',
             telefono = '${data.num}', correo = '${data.email}' WHERE usuarioid = ${data.userId}`
        );

        let response;

        if(request.rowCount > 0){
            response = {
                success: true,
                items: [],
                message: 'user updated succesfully'
            };
        }else{
            response = {
                success: false,
                items: [],
                message: 'cannot updated user'
            };
        };
        

        res.send(response);

    } catch(error){
        console.log("ERROR")
        res.status(500).send({success: false, message: error.toString() });
    }
}

const onDeleteUser = async(req, res)=> {
    try{

        //Authorize
        let auth = await Authorize(req);
        if(!auth.isAuthorized){
            res.status(401).send({success: false, message: auth.message });
            return false;
        }

        let data = req.body;

        const request = await pool.query(
            `DELETE FROM usuario where userid = ${data.userid}`
        );

        let response;

        if(request.rowCount > 0){
            response = {
                success: true,
                items: [],
                message: 'user deleted succesfully'
            };
        }else{
            response = {
                success: false,
                items: [],
                message: 'cannot deleted user'
            };
        };
        

        res.send(response);

    } catch(error){
        console.log("ERROR")
        res.status(500).send({success: false, message: error.toString() });
    }
}



module.exports = {
    onCreateUser,
    onUpdateUser,
    onDeleteUser
};

