import Queue from "bull";
import redisConfig from "../configs/libs/redis.js";
import sendNotification from "../jobs/sendNotification.js";
import FormatNotification from "../models/FormatNotification.js";

export default class NotificationQueue {
    constructor() {
        // initialize queue
        this.queue = new Queue('Notifications');
        // add a worker
        this.queue.process('notification', job => {
            this.dispatchNotification(job)
        })
    }

    addNotificationToQueue(data) {
        this.queue.add('notification', data)
    }

    async dispatchNotification(job) {
        const { data, project } = job.data;
        
        FormatNotification.sendNotification(data, project)
            .then(results => {
                if (results == 'Error: project not found') {
                    return;
                }

                console.log(results);
            }
        )
    }
}