import express from "express";
import NotificationController from "../controllers/NotificationsController.js";

const router = express.Router();

router
    .post('/notification', NotificationController.sendNotification)
    .post('/dispatch-notification', NotificationController.dispatchNotification)

export default router;   