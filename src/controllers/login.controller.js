// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onLogin = async (req, res) => {
  try {
    console.log("=> OnLogin");

    let authorization = req.headers.authorization;
    //  console.log(authorization)
    let userpass = authorization.split(" ")[1];
    //let decodedAuth = ecrypt.decryptor(userpass);
    let plainText = Buffer.from(userpass, "base64").toString("ascii");

    // Credentials
    let req_username = plainText.split(":")[0]; // Username filled by user

    //Authorize
    let auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    // Check if user exists
    var response;
    var request = await pool.query(
      `SELECT id  FROM "User" WHERE username = '${req_username}'`
    );

    if (request.rowCount == 0) {
      response = {
        success: true,
        items: request.rows,
        message: "no user was found",
      };
      res.send(response);
      return false;
    }

    response = {
      success: true,
      items: [],
      message: "login succesfull",
    };

    res.send(response);
  } catch (error) {
    console.log("ERROR");
    console.error(error);
    res.status(401).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onLogin,
};
