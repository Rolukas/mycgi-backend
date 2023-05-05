const pool = require("../database/db_connect");

const createUser = async (email, password, roleId) => {
  try {
    if (!email || !password || !roleId) {
      console.error({
        email,
        password,
        roleId,
      });
      console.error("missing params");
      return false;
    }

    const checkIfUserExists = await pool.query(`
      select * from "User" where Username = '${email}';
    `);

    if (checkIfUserExists.rowCount > 0) {
      console.error("user already exists");
      return 0;
    }

    const createNewUser = await pool.query(
      `insert into "User" (username, "password", isactive) values ('${email.trim()}', '${password.trim()}', true) RETURNING id;`
    );

    if (createNewUser.rowCount === 0) {
      console.error("cannot create user");
      console.error(createNewUser);
      return 0;
    }

    const createdUserId = createNewUser.rows[0].id;

    if (createdUserId && createUserRole(createdUserId, roleId)) {
      return createdUserId;
    }

    console.error("cannot create userId");
    return 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

const createUserRole = async (userId, roleId) => {
  try {
    const createNewUserRole = await pool.query(
      `insert into "UserProfile" (UserId, ProfileId) values (${userId}, ${roleId});`
    );

    if (createNewUserRole.rowCount === 0) {
      console.error("cannot create user-role relation with info ", {
        userId,
        roleId,
      });
      console.error(createNewUserRole);
      return false;
    }

    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

const getUserIdByRequestAuthorizationHeaders = async (req) => {
  try {
    const authorization = req.headers.authorization;
    const userpass = authorization.split(" ")[1];
    const plainText = Buffer.from(userpass, "base64").toString("ascii");
    const req_username = plainText.split(":")[0];
    const userRequest = await pool.query(
      `SELECT Id FROM "User" where username = '${req_username}'`
    );

    if (userRequest.rowCount > 0) {
      const userId = userRequest.rows[0].id;
      return userId;
    }

    return 0;
  } catch (error) {
    console.error(error);
    return 0;
  }
};

module.exports = {
  createUser,
  getUserIdByRequestAuthorizationHeaders,
};
