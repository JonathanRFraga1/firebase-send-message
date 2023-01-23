import FormatNotification from "../models/FormatNotification.js";
import ParseResult from "../models/ParseResult.js";
import NotificationQueue from "../classes/NotificationQueue.js";

class NotificationController {
    static sendNotification = (req, res) => {
        let body = req.body;

        let project = req.headers.project;

        FormatNotification.sendNotification(body, project)
            .then(results => {
                if (results == 'Error: project not found') {
                    res.status(404).json({ error: 'Project not found' });
                    return;
                }

                console.log(results);

                results = ParseResult.parse(results, body.devices);

                res.status(200).json(results)
            })
    }

    static dispatchNotification = (req, res) => {
        let project = req.headers.project;

        let bdEnv = project.toUpperCase() + 'DB';

        let dbCredentials = process.env[bdEnv];

        FormatNotification.returnNotification(dbCredentials, project);

        res.status(200).json({ message: 'Notification dispatched' })
    }
}

export default NotificationController