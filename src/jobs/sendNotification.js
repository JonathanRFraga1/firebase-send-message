import NotificationModel from "../models/NotificationModel.js";
import ParseResultModel from "../models/ParseResultModel.js";
import mysql from "mysql2/promise";
import Logger from "../classes/Logger.js";

export default {
    key: 'Notification',
    options: {
        // delay: 5000,
        attempts: 3
        //removeOnComplete: true,
    },
    async handle({ data }) {
        //throw new Error('Error: test error');
        // console.log(data);
        let {
            notification,
            tags,
            project,
            projectCredentials,
            notificationId
        } = data;

        let connection = null;

        try {
            // Create connection to database
            connection = await mysql.createConnection(projectCredentials);
        } catch (error) {
            Logger.error(
                {
                    message: `Error connecting to database`,
                    error: error.message,
                    trace: error.stack
                },
                project
            );
            return;
        }

        let devices = [];

        // Used when there are tags in the notification
        let clientsTags = [];

        if (tags.length > 0) {
            try {
                let whereTags = [];
                for (let i = 0; i < tags.length; i++) {
                    whereTags.push(`'${tags[i]}'`);
                }
                whereTags = whereTags.join(',');

                // SQL query to return clients with tags
                const sqlTags =
                    `SELECT 
                        ut_tags_clientes.id_cliente 
                    FROM 
                        ut_tags_clientes
                    INNER JOIN ut_tags ON ut_tags.id = ut_tags_clientes.id_tag
                    WHERE 
                        ut_tags.tag IN (${whereTags}) 
                    GROUP BY 
                        ut_tags_clientes.id_cliente`;
                let [rows, fields] = await connection.query(sqlTags);

                let clients = [];
                for (let i = 0; i < rows.length; i++) {
                    clients.push(rows[i].id_cliente);
                }
                clientsTags = clients;

                let whereClients = clients.join(',');

                // SQL query to return clients devices
                const sqlDevices =
                    `SELECT * FROM ut_devices WHERE id_cliente IN (${whereClients}) AND status = 1`;
                [rows, fields] = await connection.query(sqlDevices);

                for (let i = 0; i < rows.length; i++) {
                    devices.push(rows[i]);
                }
            } catch (error) {
                Logger.error(
                    {
                        message: `Error getting clients tags`,
                        error: error.message,
                        trace: error.stack
                    },
                    project
                );
            }
        } else {
            // SQL query to return clients devices
            const sqlDevices =
                `SELECT * FROM ut_devices WHERE status = 1`;
            let [rows, fields] = await connection.query(sqlDevices);

            for (let i = 0; i < rows.length; i++) {
                devices.push(rows[i]);
            }
        }

        try {
            let registrationTokens = [];
            let toSend = 1000;
            let pageCounter = 0; 

            let arrayResult = [];

            // Paginate devices to send
            for (let i = 0; i < devices.length; i++) {
                registrationTokens.push(devices[i].registration_id);
                pageCounter++;

                if (pageCounter == toSend || i == devices.length - 1) {
                    let dataNotification = {
                        notification: notification,
                        devices: registrationTokens,
                    }

                    // Send notification
                    let results = await NotificationModel.sendNotificationSynced(dataNotification, project);

                    // Parse results
                    results = ParseResultModel.parseNotificationResult(results, devices);

                    arrayResult = arrayResult.concat(results);

                    registrationTokens = [];
                    pageCounter = 0;
                }
            }

            // Updates devices status to not query again
            for (let i = 0; i < arrayResult.length; i++) {
                let tokens = arrayResult[i].errorTokens;
                for (let i = 0; i < tokens.length; i++) {
                    try {
                        let sqlUpdate = `UPDATE ut_devices SET status = 2 WHERE registration_id = '${tokens[i].registration_id}'`;
                        //Logger.info(sqlUpdate, project);
                        await connection.query(sqlUpdate);
                    } catch (error) {
                        Logger.error(
                            {
                                message: `Error updating device status`,
                                error: error.message,
                                trace: error.stack
                            },
                            project
                        );
                    }
                } 
            }

            let allClients = (tags.length > 0) ? 0 : 1;

            // Get current date and time
            let now = new Date();
            let date = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate();
            let time = now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            let dateTime = date + ' ' + time;

            // SQL query to insert notification in database
            let sqlInsertNotification = 
                `INSERT INTO 
                    ut_notificacoes (titulo, mensagem, foto, todos, data) 
                    VALUES (?, ?, '', ${allClients}, ?)`;

            let [rows, fields] = await connection.query(
                sqlInsertNotification, 
                [notification.title, notification.message, dateTime]
            );

            let lastNotification = rows.insertId;

            // SQL query to get last inserted notification id
            if (allClients == 0) {
                const sqlClientNotification = 
                    `INSERT INTO
                        ut_notificacoes_clientes (id_notificacao, id_cliente)
                        VALUES (?, ?)`;

                for (let i = 0; i < clientsTags.length; i++) {
                    await connection.query(
                        sqlClientNotification, 
                        [lastNotification, clientsTags[i]]
                    );
                }
            }

            // SQL query to change notification status to sent
            const sqlUpdateNotification =
                `UPDATE
                    cr_agendamento_notificacoes
                SET
                    status = 2
                WHERE
                    id = ${notificationId}`;

                [rows, fields] = await connection.query(sqlUpdateNotification);

                //Logger.info(rows, project);
        } catch (error) {
           Logger.error(
                {
                    message: `Error sending notification`,
                    error: error.message,
                    trace: error.stack
                },
                project
            );
        }
    }
}