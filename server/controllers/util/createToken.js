const jwt = require("jsonwebtoken");
const jwt_secret_key = process.env.JWT_SECRET;
const timeAccessTokenExpires = process.env.JWT_TIME_TO_EXPIRE;

module.exports = function(userId) {
  const access_token = jwt.sign({ user: userId }, jwt_secret_key, {
    expiresIn: `${timeAccessTokenExpires}s`
  });

  console.log("token were created");
  return access_token;
};
