
const express = require("express");
const router = express.Router();

const { getStudents } = require("../controllers/userController");

router.get("/", getStudents);

module.exports = router;
