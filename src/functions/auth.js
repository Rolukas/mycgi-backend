var pool = require('../database/db_connect');
var ecrypt = require('./ecrypt');

const Authorize = async(req) => {

    let isAuthorized = false;
    let message = '';

    try{

        let authorization = req.headers.authorization;
        console.log(authorization)
        let userpass = authorization.split(' ')[1];
        //let decodedAuth = ecrypt.decryptor(userpass);
        let plainText = Buffer.from(userpass, 'base64').toString('ascii');

        // Credentials
        let req_username = plainText.split(':')[0]; // Username filled by user
        let req_password = plainText.split(':')[1]; // Password filled by user

        // Search user 
        let search_user = await pool.query(`SELECT * FROM Usuario WHERE Usuario = '${req_username}'`);

        // User was found
        if(search_user.rows.length > 0){
            let pass_db = search_user.rows[0].password;
            isAuthorized = req_password == pass_db ? true : false;
        } else {
            isAuthorized = false;
            message = "User not found";
        }

    } catch(error){
        console.log(error);
        isAuthorized = false;
        message = error;
    }

    return{
        isAuthorized,
        message
    };

};

module.exports = Authorize;