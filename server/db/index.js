const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

let DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS;
switch (process.env.NODE_ENV) {
  case "development":
    DB_HOST = process.env.DB_HOST_DEVELOPMENT;
    DB_PORT = process.env.DB_PORT_DEVELOPMENT;
    DB_NAME = process.env.DB_NAME_DEVELOPMENT;
    DB_USER = process.env.DB_USER_DEVELOPMENT;
    DB_PASS = process.env.DB_PASS_DEVELOPMENT;
    break;
  case "production":
    DB_HOST = process.env.DB_HOST_PRODUCTION;
    DB_PORT = process.env.DB_PORT_PRODUCTION;
    DB_NAME = process.env.DB_NAME_PRODUCTION;
    DB_USER = process.env.DB_USER_PRODUCTION;
    DB_PASS = process.env.DB_PASS_PRODUCTION;
    break;
  default:
    DB_HOST = process.env.DB_HOST_DEVELOPMENT;
    DB_PORT = process.env.DB_PORT_DEVELOPMENT;
    DB_NAME = process.env.DB_NAME_DEVELOPMENT;
    DB_USER = process.env.DB_USER_DEVELOPMENT;
    DB_PASS = process.env.DB_PASS_DEVELOPMENT;
    break;
}

//for prod || "mongodb+srv://Glacialix:<password>@glacialix-lblnh.mongodb.net/test?retryWrites=true&w=majority"
const connectionURL = `mongodb://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);

mongoose
  .connect(connectionURL, { useNewUrlParser: true })
  .catch(e => console.error(e));
const db = mongoose.connection;

// Check connection
db.on("connected", () => {
  switch (process.env.NODE_ENV) {
    case "development":
      DB_MESSAGE = `Mongoose connection open on ${connectionURL} --- DEVELOPMENT mode.`;
      break;
    case "production":
      DB_MESSAGE = `Mongoose connection open on ${connectionURL} --- PRODUCTION mode.`;
      break;
    default:
      DB_MESSAGE = `Mongoose connection open on ${connectionURL} --- DEVELOPMENT mode.`;
      break;
  }
  console.log(DB_MESSAGE);
});

// Check for Db errors
db.on("error", err => console.error(err));

// Check for disconected
db.on("disconnected", () => {
  console.log("mongoose connection disconnected");
});

process.on("SIGINT", () => {
  db.close(() => {
    console.log("mongoose connection closed throw app terminatatnio");
    process.exit(0);
  });
});
