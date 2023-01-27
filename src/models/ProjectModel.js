const fs = require("fs");
const Logger = require("../classes/logger.js");
const logger = new Logger();

class ProjectModel {
    static returnFirebaseConfig(project) {
        try {
            let firebaseConfig = fs.readFileSync(`./src/configs/${project}.json`, 'utf8');
            firebaseConfig = JSON.parse(firebaseConfig);
            return firebaseConfig;
        } catch (error) {
            return 'Error: project not found'
            console.log(error);
        }
    }

    static createProjectJson(project, firebaseConfig) {
        if (fs.existsSync(`./src/configs/${project}.json`)) {
            logger.custom('Project already exists', 'Project', 'error')

            return 'Error: project already exists';
        }
        
        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));

            logger.info('Project created', project)

            return 'Project created';
        } catch (error) {
            logger.error(error, project)
            return 'Error: internal server error';
        }
    }

    static updateProjectJson(project, firebaseConfig) {
        if (!fs.existsSync(`./src/configs/${project}.json`)) {
            logger.custom('Project not found - ' + project, 'Project', 'error')

            return 'Error: project not found';
        }

        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));

            logger.info('Project updated', project)

            return 'Project updated';
        } catch (error) {
            logger.error(error, project)
            
            return 'Error: internal server error';
        }
    }
}

module.exports = ProjectModel;