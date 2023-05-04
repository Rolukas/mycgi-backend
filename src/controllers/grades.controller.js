// Modules
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onGetStudentsToGrade = async (req, res) => {
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

    const criteriaRequest = await pool.query(`
      select
      gc.Id,
      gc.Name,
      gc.minvalue as "minValue",
      gc.maxvalue as "maxValue"
      from "GradeCriteria" gc
    `);

    if (criteriaRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get criteria",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: {
        students: [...studentsRequest.rows],
        criteria: [...criteriaRequest.rows],
      },
      message: "operation completed succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onRegisterGrades = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    let response;

    const { classId, weekId, grades } = req.body;

    const isLockedRequest = await pool.query(`
        select islocked as "isLocked" from "Week" where Id = ${weekId}
    `);

    if (isLockedRequest.rowCount === 0) {
      response = {
        success: false,
        message: "cannot get week information",
        items: [],
      };
      res.send(response);
      return;
    }

    // Check if week is locked
    if (isLockedRequest.rows[0].isLocked) {
      response = {
        success: false,
        message: "week is locked",
        items: [],
      };
      res.send(response);
      return;
    }

    // Register grades
    const gradesFailed = [];
    grades.forEach(async (student) => {
      const studentId = student.studentId;
      await student.grades.forEach(async (grade) => {
        const registerGrade = await pool.query(`
                insert into "GradeWeek"
                (WeekId, ClassId, StudentId, CriteriaId, Score)
                VALUES
                (${weekId}, ${classId}, ${studentId}, ${grade.gradeCriteriaId}, ${grade.score});
            `);
        if (registerGrade.rowCount === 0) {
          console.error(
            `failed to create grade for (${weekId}, ${classId}, ${studentId}, ${grade.gradeCriteriaId}, ${grade.score})`
          );
          gradesFailed.push(studentId);
        }
      });
    });

    const lockWeekRequest = await pool.query(`
        update "Week" set isLocked = true where Id = ${weekId}
    `);

    let isWeekLocked = true;
    if (lockWeekRequest.rowCount === 0) {
      isWeekLocked = false;
    }

    response = {
      success: true,
      items: {
        gradesFailed,
        isWeekLocked,
      },
      message: "operation completed with success.",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetStudentsToGrade,
  onRegisterGrades,
};
