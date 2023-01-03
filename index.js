//#region dependency
require("dotenv").config(); //accessing the environment variables
const express = require("express");
const PORT = process.env.PORT || 4500;
const connectDB = require("./Config/dbConn");
const app = express();
const mongoose = require("mongoose");//elegant mongodb object modeling for node.js
const cors = require("cors");
const helmet = require("helmet");
const default404 = require("./middleware/default404");
const errorHandler = require("./middleware/errorHandler");
const auditLog = require("./middleware/auditLog");
const xss = require("xss-clean");
const chalk = require("chalk");
const morgan = require("morgan");
const userRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const refreshRoute = require("./routes/refresh");
const logOutRoute = require("./routes/logOut");
//#endregion

//#region  Miidlewear-ActionMethod
//Connect to MongoDB by invoking the unanimouse function
connectDB();
app.use(auditLog);
app.use(express.json()); //this middlewaer  accept json (object/List) / premitive type request
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan("tiny"));
//morgan('tiny')(':method :url :status :res[content-length] - :response-time ms')

app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/refresh", refreshRoute); //this gives a new accessToken
app.use("/api/v1/logout", logOutRoute); //this terminates the referesh token
//#endregion







//default directory middleware for url not found
app.use(default404);
//#endregion

//Global Exception handler middleware
app.use(errorHandler);



//#region  Connection
mongoose.connection.once("open", () => {
  console.log(chalk.blueBright("Connected to MongoDB"));
  //we dont want to listen below for request without connected above datasource for resources
  app.listen(PORT, () =>
    console.log(chalk.redBright(`server running  at ${PORT}...`))
  );
});
//#endregion
