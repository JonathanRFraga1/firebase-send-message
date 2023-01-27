const express = require("express");
const NotificationController = require("../controllers/NotificationsController.js");

const router = express.Router();

let notification = new NotificationController();

router
    .post('/notification', notification.sendNotification)
    .post('/dispatch-notification', notification.dispatchNotification)

exports = router;   