require("dotenv/config");
const Queue = require("./src/classes/NotificationQueue.js");
const sendNotification = require("./src/jobs/sendNotification.js");

Queue.process(sendNotification.handle);