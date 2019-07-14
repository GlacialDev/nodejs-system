const jwt = require("jsonwebtoken");
const jwt_secret_key = process.env.JWT_SECRET;

module.exports = function(token, callback) {
  jwt.verify(token, jwt_secret_key, callback);
};
