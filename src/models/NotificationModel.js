const NotificationQueue = require("../classes/NotificationQueue.js");
const ProjectModel = require("./ProjectModel.js");
const admin = require("firebase-admin");
const mysql = require("mysql2/promise");
const Logger = require("../classes/Logger.js");

const priority = 'high';
const secondsOfDay = 60 * 60 * 24;
let apps = [];

class NotificationModel {
    async sendNotificationSynced (data, project) {
        let registrationTokens = data.devices;
        let message = {
            notification: {
                title: data.notification.title,
                body: data.notification.message,
            }
        };
        let options = {
            priority: priority,
            timeToLive: data.notification.time_to_live == undefined ? secondsOfDay : data.notification.time_to_live
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

        let result;
        try {
            result = app.messaging().sendToDevice(registrationTokens, message, options)
            return result;
        } catch (error) {
            console.log(result);
            console.log(error);
            return error;
        }
    }

    async dispachNotificationAsync (project) {
        try {
            let dbCredentials = process.env.MASTERDB;
            dbCredentials = JSON.parse(dbCredentials);

            // Create connection to master database to return client database credentials
            let connectionMaster = mysql.createConnection(dbCredentials);

            // SQL query to return client database credentials
            const sqlMaster =
                `SELECT
                *
            FROM
                ut_contas
            WHERE
                dominio = ?`;
            let [rows, fields] = await (await connectionMaster).query(sqlMaster, [project]);

            if (rows.length == 0) {
                throw new Error('Project not found: ' + project, project);
            }

            // Close connection to master database
            (await connectionMaster).destroy();

            let projectCredentials = {
                host: dbCredentials.host,
                user: `beasy_${rows[0].usuario}`,
                password: rows[0].senha,
                database: `beasy_${rows[0].usuario}`
            }

            // Create connection to client database
            let connectionProject = mysql.createConnection(projectCredentials);

            // SQL query to return scheduled notifications
            const sqlNotifications =
                `SELECT
                *
            FROM
                cr_agendamento_notificacoes
            WHERE
                data <= NOW()
                AND status = 1`;
            [rows, fields] = await (await connectionProject).query(sqlNotifications);

            let notifications = rows;

            for (let i = 0; i < notifications.length; i++) {
                let notification = notifications[i];

                if (notification.tags != null && notification.tags != undefined && notification.tags != '') {
                    notification.tags = notification.tags.split(',');
                } else {
                    notification.tags = [];
                }

                let dataJob = {
                    notification: {
                        title: notification.titulo,
                        message: notification.mensagem,
                        time_to_live: notification.ttl == undefined ? secondsOfDay : notification.ttl
                    },
                    tags: notification.tags,
                    project: project,
                    projectCredentials: projectCredentials,
                    notificationId: notification.id
                }
                NotificationQueue.add('Notification', dataJob)
            }

            // Close connection to client database
            (await connectionProject).destroy();
        } catch (error) {
            Logger.error(error, project)
        }
    }

}

module.exports = NotificationModel;