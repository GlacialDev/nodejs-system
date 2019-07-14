require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
require("./db");

app.use(express.static(path.join(__dirname, "../dist")));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(cookieParser());

app.use("/api", require("./api/index"));
app.get("*", (res, req) => {
  req.redirect("/");
});

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io").listen(server);

server.listen(3000, () => {
  console.log("Server running on localhost:3000");
});

const clients = {};
io.sockets.on("connection", socket => {
  let id = socket.id;
  let username = socket.client.request.headers.username;
  let userObj = { id, username };

  clients[socket.id] = userObj;
  socket.emit("all users", clients);
  socket.broadcast.emit("new user", userObj);

  socket.on("chat message", (text, recipient) => {
    io.to(recipient).emit("chat message", text, id);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("delete user", id);
    delete clients[id];
  });
});
