const NotificationModel = require("../models/NotificationModel.js");
const ParseResultModel = require("../models/ParseResultModel.js");
const NotificationQueue = require("../classes/NotificationQueue.js");
const Logger = require("../classes/Logger.js");
const logger = new Logger('NotificationController');

class NotificationController {
    /**
     * Function to send a notification to a list of devices and return the result
     */
    sendNotification(req, res) {
        let body = req.body;

        let project = req.headers.project;
        let model = new NotificationModel();

        model.sendNotificationSynced(body, project)
            .then(results => {
                if (results == 'Error: project not found') {
                    logger.system(`Project ${project} not found`)
                    res.status(404).json({ error: 'Project not found' });
                    return;
                }

                let parseModel = new ParseResultModel();

                results = parseModel.parseNotificationResult(results, body.devices);

                res.status(200).json(results)
            })
    }

    /**
     * Function to send scheduled notifications
     * This function is called by a cron job
     * This function runs every 5 minutes
     * 
     */
    dispatchNotification(req, res) {
        let project = req.headers.project;

        let model = new NotificationModel();

        model.dispachNotificationAsync(project);

        res.status(200).json({ message: 'Notification dispatched' })
    }
}

module.exports = NotificationController