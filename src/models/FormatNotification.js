import ProjectModel from './ProjectModel.js';
import admin from 'firebase-admin';
import mysql from 'mysql';
import NotificationQueue from '../classes/NotificationQueue.js';

const priority = 'high';
let apps = [];

class FormatNotification {
    static sendNotification = async (data, project) => {
        let registrationTokens = data.devices;
        let message = {
            notification: {
                title: data.notification.title,
                body: data.notification.message,
            }
        };
        let options = {
            priority: priority,
            timeToLive: data.notification.time_to_live
        };

        let app;

        // Verify if app has already been initialized
        if (apps[project] == undefined) {
            // Return firebase config for project
            let firebaseConfig = ProjectModel.returnFirebaseConfig(project);

            if (firebaseConfig == 'Error: project not found') {
                return firebaseConfig;
            }

            // Verify if an app has already been initialized
            if (admin.apps.length == 0) {
                app = admin.initializeApp(
                    {
                        credential: admin.credential.cert(firebaseConfig),
                        databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`
                    }
                );
            } else {
                app = admin.initializeApp(
                    {
                        credential: admin.credential.cert(firebaseConfig),
                        databaseURL: `https://${firebaseConfig.project_id}.firebaseio.com`
                    },
                    project
                );
            }
            apps[project] = app;
        } else {
            // Case app has already been initialized
            app = apps[project];
        }

        return app.messaging().sendToDevice(registrationTokens, message, options)
    }

    static returnNotification = (dbCredentials, project) => {
        dbCredentials = JSON.parse(dbCredentials);
        let connection = mysql.createConnection(dbCredentials);

        connection.connect();

        const sql =
            `SELECT
                *
            FROM
                cr_agendamento_notificacoes
            WHERE
                data <= NOW()
                AND status = 1`;
        
        let notification;

        // Return notifications
        connection.query(sql, function (error, results, fields) {
            if (error) throw error;

            for (let i = 0; i < results.length; i++) {
                notification = results[i];

                if (notification.tags != null) {
                    notification.tags = notification.tags.split(',');
                }

                //TODO: Create a class to handle notification queue

                let nq = new NotificationQueue();

                // Add notification to queue
                nq.addNotificationToQueue(notification, project);
            }
        });
    }
}

export default FormatNotification;