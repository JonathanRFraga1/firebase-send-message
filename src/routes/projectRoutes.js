import express from "express";
import ProjectController from "../controllers/ProjectController.js";

const router = express.Router();

router
    .post('/project', ProjectController.makeProject)
    .put('/project', ProjectController.updateProject)

export default router;