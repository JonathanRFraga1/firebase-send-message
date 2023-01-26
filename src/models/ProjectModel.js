import fs from "fs";
import Logger from "../classes/Logger.js";

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
            Logger.custom('Project already exists', 'Project', 'error')

            return 'Error: project already exists';
        }
        
        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));

            Logger.info('Project created', project)

            return 'Project created';
        } catch (error) {
            Logger.error(error, project)
            return 'Error: internal server error';
        }
    }

    static updateProjectJson(project, firebaseConfig) {
        if (!fs.existsSync(`./src/configs/${project}.json`)) {
            Logger.custom('Project not found - ' + project, 'Project', 'error')

            return 'Error: project not found';
        }

        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));

            Logger.info('Project updated', project)

            return 'Project updated';
        } catch (error) {
            Logger.error(error, project)
            
            return 'Error: internal server error';
        }
    }
}

export default ProjectModel;