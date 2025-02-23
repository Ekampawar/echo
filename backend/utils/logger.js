const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, '../logs/app.log');

exports.logInfo = (message) => {
    const logMessage = `[INFO] ${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.log(logMessage);
};

exports.logError = (message) => {
    const logMessage = `[ERROR] ${new Date().toISOString()} - ${message}\n`;
    fs.appendFileSync(logFile, logMessage);
    console.error(logMessage);
};
