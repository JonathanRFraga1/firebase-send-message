import fs from 'fs';

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
            return 'Error: project already exists';
        }
        
        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));
            return 'Project created';
        } catch (error) {
            console.log(error);
            return 'Error: internal server error';
        }
    }

    static updateProjectJson(project, firebaseConfig) {
        if (!fs.existsSync(`./src/configs/${project}.json`)) {
            return 'Error: project not found';
        }

        try {
            fs.writeFileSync(`./src/configs/${project}.json`, JSON.stringify(firebaseConfig));
            return 'Project updated';
        } catch (error) {
            console.log(error);
            return 'Error: internal server error';
        }
    }
}

export default ProjectModel;