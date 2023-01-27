const express = require("express");
const index = require("./routes/index.js");

let routesIndex = new index();

class App {
    routes() {
        const app = express();
        app.use(express.json())
        routesIndex.routes(app);    
        return app;
    }
}



module.exports = App