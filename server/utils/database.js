const mongoose = require('mongoose');
const logger = require('./logger');

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (this.connection) {
            return this.connection;
        }

        mongoose.set("strictQuery", false);
        try {
            this.connection = await mongoose.connect(process.env.DATABASE_URL);
            logger.info("Database connection success!");
            return this.connection;
        } catch (err) {
            logger.error("Database connection unsuccessful!" + err.message);
            throw err;
        }
    }
}

const database = new Database();
module.exports = database;