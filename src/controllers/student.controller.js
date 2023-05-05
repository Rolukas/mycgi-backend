// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");
const { createUser } = require("../functions/userFunctions");

const onGetStudents = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const requestGroups = await pool.query(`SELECT 
      s.Id, 
      s.Code, 
      s.Name, 
      s.FatherLastname, 
      g.Fullname as "group",
      (select count(*) from "StudentClass" sc where sc.StudentId = s.Id) as "numberOfClasses"
      FROM "Student" as s
      join "Group" as g on g.id = s.groupId;
    `);

    const response = {
      success: true,
      items: requestGroups.rows,
      message: "students fetched succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onCreateStudent = async (req, res) => {
  try {
    let data = req.body;
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    // CHECK IF STUDENT EXISTS
    const checkIfStudentExists = await pool.query(
      `SELECT * FROM "Student" where Email = '${data.email}'`
    );

    if (checkIfStudentExists.rowCount > 0) {
      response = {
        success: false,
        items: [],
        message: "student already created",
      };

      res.send(response);
      return false;
    }

    // CREATE USER FOR STUDENT
    const studentRoleId = 3;
    const userIdCreated = await createUser(
      data.email,
      data.password,
      studentRoleId
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

    // CREATE STUDENT
    const createNewStudent = await pool.query(
      `insert into "Student"(UserId, Code, Name, FatherLastname, MotherLastname, IsActive, GroupId, HasPaid, Email) values (${userIdCreated}, '0000', '${data.name}', '${data.fatherLastName}', '${data.motherLastName}', true, ${data.groupId}, true, '${data.email}');`
    );

    if (createNewStudent.rowCount > 0) {
      response = {
        success: true,
        items: [],
        message: "student created succesfully",
      };
    } else {
      response = {
        success: false,
        items: [],
        message: "student not created",
      };
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onGetStudentsByClass = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    let response;

    const classId = req.params.id;

    if (classId == null) {
      response = {
        success: false,
        items: [],
        message: "invalid class id",
      };
      res.send(response);
      return;
    }

    const studentsRequest = await pool.query(`
      select 
      s.Id,
      s.code,
      s."name",
      s.fatherlastname,
      s.motherlastname,
      g.fullname as "group"
      from "StudentClass" sc
      join "Student" s on s.Id = sc.studentid
      join "Group" g on g.Id = s.groupid 
      where classid = ${classId} order by s."name" asc
    `);

    if (studentsRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get students",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: studentsRequest.rows,
      message: "operation completed succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetStudents,
  onCreateStudent,
  onGetStudentsByClass,
};
