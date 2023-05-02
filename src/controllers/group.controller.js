// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onGetGroups = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const requestGroups = await pool.query(`
      SELECT
      g.Id,
      g.letter,
      g."level",
      g.fullname,
      (select count(*) from "Student" s where s.groupid = g.Id) as "numberOfStudents"
      FROM "Group" g
    `);

    let response = {
      success: true,
      items: requestGroups.rows,
      message: "groups fetched succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onCreateGroup = async (req, res) => {
  try {
    let data = req.body;
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const checkIfGroupExists = await pool.query(
      `SELECT * FROM "Group" where Fullname = '${data.level}${data.letter}'`
    );

    if (checkIfGroupExists.rowCount !== 0) {
      response = {
        success: false,
        items: [],
        message: "group already created",
      };

      res.send(response);
      return false;
    }

    const createNewGroup = await pool.query(
      `insert into "Group"(Letter, Level, Fullname, IsActive) values ('${data.level}', '${data.letter}', '${data.level}${data.letter}', true)`
    );

    if (createNewGroup.rowCount > 0) {
      response = {
        success: true,
        items: [],
        message: "group created succesfully",
      };
    } else {
      response = {
        success: false,
        items: [],
        message: "cannot create group",
      };
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetGroups,
  onCreateGroup,
};
