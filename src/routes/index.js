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
  onGetStudentsByClass,
} = require("../controllers/student.controller");
const {
  onCreateTeacher,
  onGetTeachers,
} = require("../controllers/teacher.controller");
const {
  onGetSubjects,
  onCreateSubject,
} = require("../controllers/subject.controller");
const {
  onGetClasses,
  onCreateClass,
  onGetClassesByTeacher,
  onGetClassWeeks,
  onGetClassesByStudent,
  onGetClassDetail,
} = require("../controllers/class.controller");
const { onTakeAttendance } = require("../controllers/attendance.controller");
const {
  onGetStudentsToGrade,
  onRegisterGrades,
} = require("../controllers/grades.controller");

// Login
router.get("/api/Login", onLogin);

// Group
router.get("/api/Group", onGetGroups);
router.post("/api/Group", onCreateGroup);

// Student
router.get("/api/Student", onGetStudents);
router.get("/api/StudentsByClass/:id", onGetStudentsByClass);
router.post("/api/Student", onCreateStudent);

// Teacher
router.get("/api/Teacher", onGetTeachers);
router.post("/api/Teacher", onCreateTeacher);

// Subject
router.get("/api/Subject", onGetSubjects);
router.post("/api/Subject", onCreateSubject);

// Class
router.get("/api/Class", onGetClasses);
router.get("/api/ClassesByTeacher", onGetClassesByTeacher);
router.get("/api/WeeksByClass/:id", onGetClassWeeks);
router.get("/api/ClassesByStudent", onGetClassesByStudent);
router.get("/api/ClassDetail/:id", onGetClassDetail);
router.post("/api/Class", onCreateClass);

// Attendance
router.post("/api/Attendance", onTakeAttendance);

// Grades
router.get("/api/StudentsToGrade/:id", onGetStudentsToGrade);
router.post("/api/Grades/", onRegisterGrades);

module.exports = router;
