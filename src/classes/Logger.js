const fs = require("fs");
const os = require("os");
const stringify = require("querystring").stringify;
class Logger {
    format(message) {
        let now = new Date();
        let dayWithZero = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
        let monthWithZero = (now.getMonth() + 1) < 10 ? "0" + (now.getMonth() + 1) : (now.getMonth() + 1);
        let hourWithZero = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
        let minuteWithZero = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
        let secondWithZero = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
        let dateTime = `${now.getFullYear()}-${monthWithZero}-${dayWithZero} ${hourWithZero}:${minuteWithZero}:${secondWithZero}`;
        message = typeof message === "object" ? JSON.stringify(message) : message;
        message = `[${dateTime}] - ` + message;
        return message;
    }

    error(message, project) {
        try {
            message = this.format(message);
            console.error(message);
            message = `${message}${os.EOL}`;
            fs.existsSync("./logs/error") || fs.mkdirSync("./logs/error");

            fs.appendFile(`./logs/error/${project}-error.log`, message, (err) => {
                if (err) throw err;
            });
        } catch (error) {
            console.log(error);
        }
    }

    info(message, project) {
        try {
            message = this.format(message);
            console.info(message);
            message = `${message}${os.EOL}`;
            fs.existsSync("./logs/info") || fs.mkdirSync("./logs/info");

            fs.appendFile(`./logs/info/${project}-info.log`, message, (err) => {
                if (err) throw err;
            });
        } catch (error) {
            console.log(error);
        }
    }

    custom(message, project, type) {
        try {
            message = this.format(message);
            console.log(message);
            message = `${message}${os.EOL}`;
            fs.existsSync("./logs/custom") || fs.mkdirSync("./logs/custom");

            fs.appendFile(`./logs/custom/${project}-${type}.log`, message, (err) => {
                if (err) throw err;
            });
        } catch (error) {
            console.log(error);
        }
    }

    system(message) {
        try {
            message = this.format(message);
            console.log(message);
            message = `${message}${os.EOL}`;
            fs.existsSync("./logs") || fs.mkdirSync("./logs");

            fs.appendFile(`./logs/system.log`, message, (err) => {
                if (err) throw err;
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports = Logger;