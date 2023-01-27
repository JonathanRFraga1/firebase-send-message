const App = require("./src/app.js");
const dotenv = require("dotenv");
const Logger = require("./src/classes/Logger.js");
const logger = new Logger();

let app = new App().routes();

dotenv.config()
const port = process.env.PORT || 3000;
const host = process.env.HOST || "http://localhost";

app.listen(port, () => {
  logger.system(`Servidor escutando em ${host}:${port}`)
})