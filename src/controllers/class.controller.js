// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");
const {
  getUserIdByRequestAuthorizationHeaders,
} = require("../functions/userFunctions");
const { getTeacherIdByUserId } = require("../functions/teacherFunctions");
const { getStudentIdByUserId } = require("../functions/studentFunctions");

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

    // Create 14 weeks
    for (let i = 1; i <= 14; i++) {
      const insertWeek = await pool.query(`
        INSERT INTO "Week"(Number, ClassId, IsLocked, IsActive) VALUES (${i}, ${classId}, false, true);
      `);

      if (insertWeek.rowCount === 0) console.error("cannot insert week");
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

    const teacherId = await getTeacherIdByUserId(userId);

    if (!teacherId || teacherId === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get teacherId",
      };
      res.send(response);
      return;
    }

    const getClassesRequest = await pool.query(`
      select c.Id, 
      s.Name as "subjectName",
      (select count(*) from "StudentClass" sc where sc.ClassId = c.Id) as "numberOfStudents",
      (select count(*) 
        from "Attendance" a 
        where 
        a.date = now()::date 
        and 
        a.classId = c.Id
      ) as "numberOfAttendancesToday",
      c.days,
      c.startHour as "startHour",
      c.endHour as "endHour"
      from "Class" c
      join "Teacher" t on t.Id = c.TeacherId
      join "Subject" s on s.Id = c.SubjectId
      where c.TeacherId = ${teacherId};
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

    const addTodayAndCurrent = () => {
      const today = new Date();
      const convertToMinutes = (hours, minutes) => {
        const parseHours = parseInt(hours) * 60;
        const parseMinutes = parseInt(minutes);
        return parseHours + parseMinutes;
      };

      const isBetweenTimeRange = (startHour, endHour) => {
        const splitStartHours = startHour.split(":");
        const startMinutes = convertToMinutes(
          splitStartHours[0],
          splitStartHours[1]
        );

        const splitEndHours = endHour.split(":");
        const endMinutes = convertToMinutes(splitEndHours[0], splitEndHours[1]);

        const currentTimeToMinutes = convertToMinutes(
          today.getHours(),
          today.getMinutes()
        );

        if (
          currentTimeToMinutes >= startMinutes &&
          currentTimeToMinutes <= endMinutes
        ) {
          return true;
        }

        return false;
      };

      return getClassesRequest.rows.map((classData) => {
        // Find if class is today
        const classDays = classData.days;
        const classDaysArr = classDays.split(",");
        const daysLetters = ["Su", "L", "M", "Mi", "J", "V", "S"];
        const todayLetter = daysLetters[today.getDay()]; // Sunday - Saturday : 0 - 6
        const isToday = classDaysArr.includes(todayLetter);

        // Find if class is happening right now
        const { startHour, endHour } = classData;
        let isCurrent = false;
        let isBlocked = false;
        if (isToday) {
          isCurrent = isBetweenTimeRange(startHour, endHour);
          isBlocked = classData.numberOfAttendancesToday > 0;
        }

        return {
          ...classData,
          isToday,
          isCurrent,
          isBlocked,
        };
      });
    };

    const classes = addTodayAndCurrent();

    response = {
      success: true,
      items: classes, // Only returns today classes
      message: "operation completed with success",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onGetClassWeeks = async (req, res) => {
  try {
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

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

    const weeksRequest = await pool.query(`
      select 
      w.Id,
      w.Number,
      w.IsLocked as "isLocked"
      from "Week" w where w.ClassId = ${classId} order by number asc
    `);

    if (weeksRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get weeks",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: weeksRequest.rows,
      message: "operation completed with success",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onGetClassesByStudent = async (req, res) => {
  try {
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const userId = await getUserIdByRequestAuthorizationHeaders(req);

    if (!userId || userId === 0) {
      response = {
        success: false,
        items: [],
        message: "invalid user id",
      };
      res.send(response);
      return;
    }

    const studentId = await getStudentIdByUserId(userId);

    if (!studentId || studentId === 0) {
      response = {
        success: false,
        items: [],
        message: "invalid student id",
      };
      res.send(response);
      return;
    }

    const classesRequest = await pool.query(`
      select
      sc.classid as "classId",
      s."name" as "subjectName",
      concat(t.Name, ' ', t.fatherlastname, ' ', t.motherlastname) as "teacherName",
      (select count(*) from "Attendance" a where a.classid = c.id and a.isattendance <> true) as "numberOfAbsences",
      c.days as "classDays",
      c.starthour as "startHour",
      c.endhour as "endHour"
      from "StudentClass" sc
      join "Class" c on c.Id = sc.classid
      join "Subject" s on s.id = c.subjectid 
      join "Teacher" t on t.id = c.teacherid 
      where sc.studentid = ${studentId};
    `);

    if (classesRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get weeks",
      };
      res.send(response);
      return;
    }

    response = {
      success: true,
      items: classesRequest.rows,
      message: "operation completed with success",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onGetClassDetail = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    let response;

    const userId = await getUserIdByRequestAuthorizationHeaders(req);

    if (!userId || userId === 0) {
      response = {
        success: false,
        items: [],
        message: "invalid user id",
      };
      res.send(response);
      return;
    }

    const studentId = await getStudentIdByUserId(userId);

    if (!studentId || studentId === 0) {
      response = {
        success: false,
        items: [],
        message: "invalid student id",
      };
      res.send(response);
      return;
    }

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

    const classRequest = await pool.query(`
      select 
      gw.classid,
      w."number" as "weekNumber",
      gc."name" as "gradeCriteria",
      gw.score
      from "GradeWeek" gw 
      join "Week" w ON w.id = gw.weekid
      join "GradeCriteria" gc ON gc.id = gw.criteriaid 
      where gw.classid = ${classId} and gw.studentid = ${studentId};
    `);

    if (classRequest.rowCount === 0) {
      response = {
        success: false,
        items: [],
        message: "cannot get class detail",
      };
      res.send(response);
      return;
    }

    function transformArray(array) {
      const transformedArray = [];

      array.forEach((item) => {
        const { weekNumber, gradeCriteria, score } = item;
        const existingEntry = transformedArray.find(
          (entry) => entry.weekNumber === weekNumber
        );

        if (existingEntry) {
          existingEntry.grades.push({ gradeCriteria, score: parseInt(score) });
        } else {
          transformedArray.push({
            weekNumber,
            grades: [{ gradeCriteria, score: parseInt(score) }],
          });
        }
      });

      return transformedArray;
    }

    const transformedArray = transformArray(classRequest.rows);

    response = {
      success: true,
      items: transformedArray,
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
  onGetClassWeeks,
  onGetClassesByStudent,
  onGetClassDetail,
};
