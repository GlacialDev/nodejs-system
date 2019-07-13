const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
require("./db");

app.use(express.static(path.join(__dirname, "../dist")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use("/api", require("./api/index"));
app.get("*", (res, req) => {
  req.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
