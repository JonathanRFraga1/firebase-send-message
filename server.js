import app from "./src/app.js"
import dotenv from "dotenv"
import logger from "./src/classes/Logger.js";

dotenv.config()
const port = process.env.PORT || 3000;
const host = process.env.HOST || "http://localhost";

app.listen(port, () => {
  logger.system(`Servidor escutando em ${host}:${port}`)
})