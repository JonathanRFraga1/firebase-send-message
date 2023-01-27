const Logger = require("../classes/Logger.js");
const ProjectModel = require("../models/ProjectModel.js");

class ProjectController {
    makeProject(req, res) {
        let body = req.body;

        let project = req.headers.project;
        let token = req.headers.token;

        if (token != process.env.TOKEN) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        let results = ProjectModel.createProjectJson(project, body);

        if (results == 'Error: internal server error') {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results == 'Error: project already exists') {
            res.status(409).json({ error: 'Project already exists' });
            return;
        }

        res.status(201).json({ message: 'Project created' });
    }

    updateProject(req, res) {
        let body = req.body;

        let project = req.headers.project;
        let token = req.headers.token;

        if (token != process.env.TOKEN) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        let results = ProjectModel.updateProjectJson(project, body);

        if (results == 'Error: internal server error') {
            res.status(500).json({ error: 'Internal server error' });
            return;
        }

        if (results == 'Error: project not found') {
            res.status(404).json({ error: 'Project not found' });
            return;
        }

        res.status(200).json({ message: 'Project updated' });
    }
}

module.exports = ProjectController;
