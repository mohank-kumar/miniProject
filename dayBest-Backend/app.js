const express = require("express");
const dotEnv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./db');
const routes = require("./routes/index");
const app = express();

//env config
dotEnv.config()

// Body parser
app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

// Request Logger
if (process.env.NODE_ENV == "dev") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
}


connectDB()

app.use('/api/v1', routes)

module.exports = app;



