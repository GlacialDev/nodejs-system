const User = require("../db/models/user");

exports.update = data =>
  new Promise(async (resolve, reject) => {
    try {
      const { id, permission } = data;
      const user = await User.findOneAndUpdate(
        { permissionId: id },
        {
          permission: permission
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
