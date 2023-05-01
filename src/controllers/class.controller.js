// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");
const {
  getUserIdByRequestAuthorizationHeaders,
} = require("../functions/userFunctions");

const onGetClasses = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    let response;

    const requestClasses = await pool.query(
      `select c.Id, 
      concat(t.Name, ' ', t.fatherlastname, ' ', t.motherlastname) as "teacherName",
      s.Name as "subjectName",
      (select count(*) from "StudentClass" sc where sc.ClassId = c.Id) as "numberOfStudents",
      c.days
      from "Class" c
      join "Teacher" t on t.Id = c.TeacherId
      join "Subject" s on s.Id = c.SubjectId`
    );

    if (requestClasses.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get classes",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: requestClasses.rows,
      message: "students fetched succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onCreateClass = async (req, res) => {
  try {
    let data = req.body;
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const { subjectId, teacherId, startHour, endHour, students, days } = data;

    const createClass = await pool.query(
      `INSERT INTO "Class" (SubjectId, TeacherId, StartHour, EndHour, IsActive, Days) VALUES (${subjectId}, ${teacherId}, '${startHour}', '${endHour}', true, '${days}') RETURNING id`
    );

    if (createClass.rowCount < 0) {
      response = {
        success: false,
        items: [],
        message: "class not created",
      };
      res.send(response);
      return;
    }

    const classId = createClass.rows[0].id;

    const failedStudents = [];
    students.forEach(async (studentId) => {
      const insertStudent = await pool.query(
        `INSERT INTO "StudentClass" (StudentId, ClassId) VALUES (${parseInt(
          studentId
        )}, ${classId})`
      );

      if (insertStudent.rowCount < 0) failedStudents.push(studentId);
    });

    if (failedStudents.length > 0) {
      response = {
        success: true,
        items: failedStudents,
        message: "class created but some students were not added",
      };
    } else {
      response = {
        success: true,
        items: [],
        message: "class created succesfully",
      };
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onGetClassesByTeacher = async (req, res) => {
  try {
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const userId = await getUserIdByRequestAuthorizationHeaders(req);

    if (userId === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get user",
      };
      res.send(response);
      return;
    }

    const getClassesRequest = await pool.query(`
      select c.Id, 
      s.Name as "subjectName",
      (select count(*) from "StudentClass" sc where sc.ClassId = c.Id) as "numberOfStudents",
      c.days,
      c.startHour,
      c.endHour
      from "Class" c
      join "Teacher" t on t.Id = c.TeacherId
      join "Subject" s on s.Id = c.SubjectId
      where c.TeacherId = ${userId};
    `);

    if (getClassesRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get classes",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: getClassesRequest.rows,
      message: "operation completed with success",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetClasses,
  onCreateClass,
  onGetClassesByTeacher,
};
