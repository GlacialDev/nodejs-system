const express = require("express");
const router = express.Router();

require("./login")(router);
require("./users")(router);
require("./news")(router);
require("./permissions")(router);

module.exports = router;
