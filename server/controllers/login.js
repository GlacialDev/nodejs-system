const User = require("../db/models/user");

exports.login = data =>
  new Promise(async (resolve, reject) => {
    try {
      const { username, password, remembered } = { ...data };
      const user = await User.find({ username });
      const result = User(...user);

      if (remembered) {
        // TODO: token, session, idk what i need to do for now
      }

      // TODO: localStrategy passport.js ( ? )
      if (result.validPassword(password)) {
        resolve(result);
      } else {
        reject({
          message: "Invalid password",
          statusCode: 500
        });
      }
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });

exports.authFromToken = data => {
  const { access_token } = data;

  new Promise(async (resolve, reject) => {
    try {
      const user = await User.find({ access_token });

      resolve(user);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });
};
