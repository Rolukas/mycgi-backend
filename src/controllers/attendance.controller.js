// Modules
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onTakeAttendance = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const data = req.body;
    const { attendances, classId } = data;

    const allStudentsRequest = await pool.query(`
            select 
            sc.StudentId as "id"
            from "StudentClass" sc
            where classid = ${classId};
        `);

    if (allStudentsRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get all students",
      };
      res.send(response);
      return;
    }

    const failedAttendances = [];
    const allStudentsInClass = allStudentsRequest.rows;
    allStudentsInClass.forEach(async (student) => {
      const isAttendance = attendances.includes(student.id);
      const insertAttendance = await pool.query(`
            INSERT INTO "Attendance"
            (Date, ClassId, StudentId, IsAttendance, IsActive) 
            VALUES (
                to_timestamp(${Date.now()} / 1000.0),
                ${classId}, 
                ${student.id},
                ${isAttendance},
                true
            );
        `);

      if (insertAttendance.rowCount === 0) failedAttendances.push(student.id);
    });

    response = {
      success: true,
      items: failedAttendances,
      message: "operation completed succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onTakeAttendance,
};
