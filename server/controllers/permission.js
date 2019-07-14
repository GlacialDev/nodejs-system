const User = require("../db/models/user");

exports.update = data =>
  new Promise(async (resolve, reject) => {
    try {
      console.log(data.data);
      const { permissionId, permission } = data.data;
      const user = await User.findOneAndUpdate(
        { permissionId },
        {
          permission
        }
      );

      user.save();

      resolve(user);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });
