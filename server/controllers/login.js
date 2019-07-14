const User = require("../db/models/user");
const jwt_secret_key = process.env.JWT_SECRET;
const timeAccessTokenExpires = process.env.JWT_TIME_TO_EXPIRE;

const tokenVerify = require("./util/tokenVerify");
const createToken = require("./util/createToken");

exports.login = (data, res) =>
  new Promise(async (resolve, reject) => {
    try {
      const { username, password, remembered } = { ...data };
      const user = await User.find({ username });
      const access_token = createToken(user.id);
      const userWithNewToken = await User.findOneAndUpdate(
        { username },
        { access_token }
      );
      userWithNewToken.save();
      const result = User({
        permission: userWithNewToken.permission,
        username: userWithNewToken.username,
        password: userWithNewToken.password,
        firstName: userWithNewToken.firstName,
        surName: userWithNewToken.surName,
        middleName: userWithNewToken.middleName,
        image: userWithNewToken.image,
        access_token: userWithNewToken.access_token,
        id: userWithNewToken.id,
        permissionId: userWithNewToken.permissionId
      });

      if (remembered) {
        res.cookie("access_token", access_token, {
          maxAge: timeAccessTokenExpires,
          httpOnly: false
        });
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

exports.authFromToken = data =>
  new Promise(async (resolve, reject) => {
    const { access_token } = data;

    try {
      tokenVerify(access_token, jwt_secret_key, () =>
        reject({
          message: "bad token",
          statusCode: 500
        })
      );
      const user = await User.find({ access_token });

      resolve(user[0]);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });
