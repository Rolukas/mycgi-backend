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
      return false;
    }

    const createNewUser = await pool.query(
      `insert into "User" (username, "password", isactive) values ('${email.trim()}', '${password.trim()}', true) RETURNING id;`
    );

    if (createNewUser.rowCount === 0) {
      console.error("cannot create user");
      console.error(createNewUser);
      return false;
    }

    const createdUserId = createNewUser.rows[0].id;

    if (createdUserId && createUserRole(createdUserId, roleId)) {
      return true;
    }

    console.error("cannot create userId");
    return false;
  } catch (e) {
    console.error(e);
    return false;
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

module.exports = {
  createUser,
};
