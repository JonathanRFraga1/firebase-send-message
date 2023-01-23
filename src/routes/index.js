import express from "express";
import notifications from "./notificationsRoutes.js"
import projects from "./projectRoutes.js"

const routes = (app) => {
  app.route('/').get((req, res) => {
    res.status(200).send({titulo: "Notificações Firebase"})
  })

  app.use(
    express.json(),
    notifications,
    projects
  )
}

export default routes