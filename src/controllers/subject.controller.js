// Modules
const router = require("../routes");
const Authorize = require("../functions/auth");

// DB connection
const pool = require("../database/db_connect");

const onGetSubjects = async (req, res) => {
  try {
    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const requestGroups = await pool.query(`
      select
      s.Id,
      s.Code,
      s.Name,
      (select count(*) from "Class" c where c.SubjectId = s.Id) as "numberOfClasses"
      from "Subject" s
    `);

    let response = {
      success: true,
      items: requestGroups.rows,
      message: "subjects fetched succesfully",
    };

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

const onCreateSubject = async (req, res) => {
  try {
    let data = req.body;
    let response;

    //Authorize
    const auth = await Authorize(req);
    if (!auth.isAuthorized) {
      res.status(401).send({ success: false, message: auth.message });
      return false;
    }

    const checkIfSubjectExists = await pool.query(
      `SELECT lower(Name) as "Name" FROM "Subject" where Name = '${data.name
        .toLowerCase()
        .trim()}'`
    );

    if (checkIfSubjectExists.rowCount > 0) {
      response = {
        success: false,
        items: [],
        message: "subject already created",
      };

      res.send(response);
      return false;
    }

    const createNewSubject = await pool.query(
      `insert into "Subject"(Code, Name, IsActive) values ('0000', '${data.name.trim()}', true);`
    );

    if (createNewSubject.rowCount > 0) {
      response = {
        success: true,
        items: [],
        message: "subject created succesfully",
      };
    } else {
      response = {
        success: false,
        items: [],
        message: "subject not created",
      };
    }

    res.send(response);
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.toString() });
  }
};

module.exports = {
  onGetSubjects,
  onCreateSubject,
};
