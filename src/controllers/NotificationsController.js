import NotificationModel from "../models/NotificationModel.js";
import ParseResultModel from "../models/ParseResultModel.js";
import NotificationQueue from "../classes/NotificationQueue.js";
import Logger from "../classes/Logger.js";

class NotificationController {
    /**
     * Function to send a notification to a list of devices and return the result
     */
    static sendNotification = (req, res) => {
        let body = req.body;

        let project = req.headers.project;

        NotificationModel.sendNotificationSynced(body, project)
            .then(results => {
                if (results == 'Error: project not found') {
                    Logger.system(`Project ${project} not found`)
                    res.status(404).json({ error: 'Project not found' });
                    return;
                }

                results = ParseResultModel.parseNotificationResult(results, body.devices);

                res.status(200).json(results)
            })
    }

    /**
     * Function to send scheduled notifications
     * This function is called by a cron job
     * This function runs every 5 minutes
     * 
     */
    static dispatchNotification = (req, res) => {
        let project = req.headers.project;

        NotificationModel.dispachNotificationAsync(project);

        res.status(200).json({ message: 'Notification dispatched' })
    }
}

export default NotificationController