// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onLogin = async (req, res) => {
  try {
    const authorization = req.headers.authorization;
    const userpass = authorization.split(" ")[1];
    //let decodedAuth = ecrypt.decryptor(userpass);
    const plainText = Buffer.from(userpass, "base64").toString("ascii");

    // Credentials
    const req_username = plainText.split(":")[0]; // Username filled by user

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    // Check if user exists
    let response = {
      success: false,
      items: [],
    };

    const userRequest = await pool.query(
      `SELECT id FROM "User" WHERE username = '${req_username}'`
    );

    if (userRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "user not found",
      };
      res.send(response);
      return false;
    }

    const profileRequest = await pool.query(
      `select p.Id, p.Name FROM "UserProfile" up 
      JOIN "Profile" p on p.Id = up.ProfileId
      WHERE UserId = ${userRequest.rows[0].id}`
    );

    if (profileRequest.rowCount == 0) {
      response = {
        success: false,
        items: [],
        message: "user not found",
      };
    }

    const modulesRequest = await pool.query(
      `SELECT
      M.Id, M.Name, MC.Name as "categoryName", MC.Id as "categoryId"
      FROM "User"  as U
      JOIN "UserProfile"  as UP on U.Id = UP.UserId
      JOIN "Profile" as P on UP.ProfileId = P.Id
      JOIN "ProfileModule"  as MP on MP.ProfileId = P.Id
      JOIN "Module"  as M on MP.ModuleId = M.Id
      JOIN "ModuleCategory" as MC on MC.Id = M.categoryId
      where U.Id = ${userRequest.rows[0].id} and M.IsActive = true;`
    );

    response = {
      success: true,
      items: [
        {
          profileId: profileRequest.rows[0].id,
          modules: [...modulesRequest.rows.map((module) => module)],
          profileName: profileRequest.rows[0].name,
        },
      ],
      message: "login succesful",
    };

    res.send(response);
  } catch (error) {
    console.error(error?.message);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onLogin,
};
