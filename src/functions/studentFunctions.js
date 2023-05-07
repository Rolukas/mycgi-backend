const pool = require("../database/db_connect");

const getStudentIdByUserId = async (userId) => {
  try {
    if (!userId || userId === 0) {
      return 0;
    }

    const studentIdRequest = await pool.query(`
        select * from "Student" where UserId = ${userId}
    `);

    if (studentIdRequest.rowCount > 0) {
      return studentIdRequest.rows[0].id;
    }

    return 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

module.exports = {
  getStudentIdByUserId,
};
