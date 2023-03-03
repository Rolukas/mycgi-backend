// Modules
const router = require("../routes");
const Authorize = require('../functions/auth');

// DB connection
const pool = require('../database/db_connect');
const { response } = require("express");


const onCreateRelationProfile = async(req, res) => {

    try{

        let data = req.body;
        let response;
        const request = await pool.query(
            `INSERT INTO UsuarioPerfil(UsuarioId, PerfilId) VALUES (${data.userId}, ${data.profileId})`
        );

        console.log(request)

        if(request.rowCount > 0){
            response = {
                success: true,
                items: [],
                message: 'user-profile relation created succesfully'
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
        res.status(401).send({success: false, message: error.toString() });
    }

};

module.exports = {
    onCreateRelationProfile
};