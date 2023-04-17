// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onGetStudents = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const requestGroups =
      await pool.query(`SELECT s.Id, s.Code, s.Name, s.FatherLastname, g.Fullname as "group" FROM "Student" as s
    join "Group" as g on g.id = s.groupId;`);

    let response = {
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

    const createNewStudent = await pool.query(
      `insert into "Student"(Code, Name, FatherLastname, MotherLastname, IsActive, GroupId, HasPaid, Email) values ('0000', '${data.name}', '${data.fatherLastName}', '${data.motherLastName}', true, ${data.groupId}, true, '${data.email}');`
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

module.exports = {
  onGetStudents,
  onCreateStudent,
};
