import "dotenv/config";
import Queue from "./src/classes/NotificationQueue.js";
import sendNotification from "./src/jobs/sendNotification.js";

Queue.process(sendNotification.handle);