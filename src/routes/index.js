// Modules
const { Router } = require("express");
const router = Router();

/* Controllers */
const { onLogin } = require("../controllers/login.controller");
const {
  onCreateGroup,
  onGetGroups,
} = require("../controllers/group.controller");
const {
  onGetStudents,
  onCreateStudent,
} = require("../controllers/student.controller");
const {
  onCreateTeacher,
  onGetTeachers,
} = require("../controllers/teacher.controller");

// Login
router.get("/api/Login", onLogin);

// Group
router.get("/api/Group", onGetGroups);
router.post("/api/Group", onCreateGroup);

// Student
router.get("/api/Student", onGetStudents);
router.post("/api/Student", onCreateStudent);

// Teacher
router.get("/api/Teacher", onGetTeachers);
router.post("/api/Teacher", onCreateTeacher);

module.exports = router;
