// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");
const { createUser } = require("../functions/userFunctions");

const onGetTeachers = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const requestGroups = await pool.query(
      `SELECT 
      t.Id, 
      t.Name, 
      t.FatherLastname,
      (select count(*) from "Class" c where c.TeacherId = t.Id) as "numberOfClasses"
      FROM "Teacher" t`
    );

    let response = {
      success: true,
      items: requestGroups.rows,
      message: "teachers fetched succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onCreateTeacher = async (req, res) => {
  try {
    let data = req.body;
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const checkIfTeacherExists = await pool.query(
      `SELECT * FROM "Teacher" where Email = '${data.email}'`
    );

    if (checkIfTeacherExists.rowCount > 0) {
      response = {
        success: false,
        items: [],
        message: "teacher already created",
      };

      res.send(response);
      return false;
    }

    // CREATE USER FOR TEACHER
    const teacherRoleId = 2;
    const userIdCreated = await createUser(
      data.email,
      data.password,
      teacherRoleId
    );

    if (userIdCreated === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot create user",
      };

      res.send(response);
      return false;
    }

    const createNewTeacher = await pool.query(
      `insert into "Teacher"(UserId, Code, Name, FatherLastname, MotherLastname, IsActive, Email) values (${userIdCreated} ,'0000', '${data.name}', '${data.fatherLastName}', '${data.motherLastName}', true, '${data.email}');`
    );

    if (createNewTeacher.rowCount > 0) {
      response = {
        success: true,
        items: [],
        message: "teacher created succesfully",
      };
    } else {
      response = {
        success: false,
        items: [],
        message: "teacher not created",
      };
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetTeachers,
  onCreateTeacher,
};
