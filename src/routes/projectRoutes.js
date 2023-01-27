const express = require("express");
const ProjectController = require("../controllers/ProjectController.js");

let project = new ProjectController();

const router = express.Router();

router
    .post('/project', project.makeProject)
    .put('/project', project.updateProject)

exports = router;