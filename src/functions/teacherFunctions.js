const pool = require("../database/db_connect");

const getTeacherIdByUserId = async (userId) => {
  try {
    if (!userId || userId === 0) {
      return 0;
    }

    const teacherIdRequest = await pool.query(`
        select * from "Teacher" where UserId = ${userId}
    `);

    if (teacherIdRequest.rowCount > 0) {
      return teacherIdRequest.rows[0].id;
    }

    return 0;
  } catch (e) {
    console.error(e);
    return 0;
  }
};

module.exports = {
  getTeacherIdByUserId,
};
