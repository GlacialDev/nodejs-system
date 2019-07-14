const User = require("../db/models/user");

exports.update = data =>
  new Promise(async (resolve, reject) => {
    try {
      const { permissionId, permission } = data.data;

      const oldUserData = await User.findOne({ permissionId });
      const oldPermission = oldUserData.permission;
      const newPermission = Object.assign(oldPermission, permission);

      const user = await User.findOneAndUpdate(
        { permissionId },
        { permission: newPermission }
      );

      let result = await user.save();

      resolve(result);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });
