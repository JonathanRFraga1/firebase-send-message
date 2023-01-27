const express = require("express");
const NotificationController = require("../controllers/NotificationsController.js");
const ProjectController = require("../controllers/ProjectController.js");


class Index {
  routes(app) {
    let notification = new NotificationController();
    let project = new ProjectController();

    app.route('/')
      .get((req, res) => {
        res.status(200).send({ titulo: "Notificações Firebase" })
      });

    app.route('/notification')
      .post((req, res) => {
        notification.sendNotification(req, res)
      });

    app.route('/dispatch-notification')
      .post((req, res) => {
        notification.dispatchNotification(req, res)
      })

    app.route('/dispatch-notification')
      .post((req, res) => {
        project.makeProject(req, res)
      })

    app.route('/project')
      .post((req, res) => {
        project.makeProject(req, res)
      })
      .put((req, res) => {
        project.updateProject(req, res)
      })

    app.use(
      express.json(),
    )
  }
}

module.exports = Index