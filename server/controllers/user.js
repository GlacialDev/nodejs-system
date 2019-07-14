const User = require("../db/models/user");
const uuidv4 = require("uuid/v4");
const Joi = require("@hapi/joi");

const fs = require("fs");
const util = require("util");
const path = require("path");

const access = util.promisify(fs.access);
const mkdir = util.promisify(fs.mkdir);
const unlink = util.promisify(fs.unlink);
const rename = util.promisify(fs.rename);

const newUserSchema = Joi.object().keys({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  img: Joi.string().allow(""),
  permission: Joi.object().keys({
    chat: Joi.object().keys({
      C: Joi.boolean(),
      R: Joi.boolean(),
      U: Joi.boolean(),
      D: Joi.boolean()
    }),
    news: Joi.object().keys({
      C: Joi.boolean(),
      R: Joi.boolean(),
      U: Joi.boolean(),
      D: Joi.boolean()
    }),
    setting: Joi.object().keys({
      C: Joi.boolean(),
      R: Joi.boolean(),
      U: Joi.boolean(),
      D: Joi.boolean()
    })
  }),
  surName: Joi.string().alphanum(),
  firstName: Joi.string().alphanum(),
  middleName: Joi.string().alphanum(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required()
});

const updateUserSchema = Joi.object().keys({
  surName: Joi.string().alphanum(),
  image: Joi.string().alphanum(),
  firstName: Joi.string().alphanum(),
  middleName: Joi.string().alphanum(),
  oldPassword: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/)
});

const createToken = require("./util/createToken");

exports.getUsers = () =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await User.find();

      resolve(result);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });

exports.saveNewUser = user =>
  new Promise(async (resolve, reject) => {
    try {
      const { error, value } = Joi.validate({ ...user }, newUserSchema);
      if (error) {
        return reject({
          message: error,
          statusCode: 400
        });
      }

      user.image = user.img;
      delete user.img;
      let id = uuidv4();
      let access_token = createToken(id);
      let permissionId = uuidv4();

      const newUser = new User({
        ...user,
        access_token,
        id,
        permissionId
      });
      newUser.setPassword(user.password);

      const result = await newUser.save();

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });

// exports.getOneUser = data =>
//   new Promise(async (resolve, reject) => {
//     const { id } = data;
//     try {
//       if (!id) {
//         return reject("id is required");
//       }

//       const result = await User.findOne({ id });

//       resolve(result);
//     } catch (err) {
//       reject(err);
//     }
//   });

exports.updateUser = data =>
  new Promise(async (resolve, reject) => {
    const { id, firstName, middleName, surName, oldPassword, password } = {
      ...data
    };

    try {
      if (!id) {
        return reject("id is required");
      }

      const { error, value } = Joi.validate(
        { firstName, middleName, surName, oldPassword, password },
        updateUserSchema
      );
      if (error) {
        return reject(error);
      }

      let oldUserData = await User.findOne({ id });
      if (oldUserData.validPassword(oldPassword)) {
        let user = await User.findOneAndUpdate(
          { id },
          {
            firstName,
            middleName,
            surName
          }
        );
        user.setPassword(password);

        const result = await user.save();

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

exports.updateUserImage = data =>
  new Promise(async (resolve, reject) => {
    const { id } = data;
    const image = data[0];
    const {
      originalname: imageName,
      path: imageTempPath,
      size: imageSize
    } = image;

    // console.log(id);
    // console.log(imageName);
    // console.log(imageTempPath);
    // console.log(imageSize);
    try {
      const uploadDir = path.join(process.cwd(), "/dist", "images", "avatars");
      console.log(process.cwd());

      try {
        await access(uploadDir, fs.constants.F_OK);
      } catch (err) {
        await mkdir(uploadDir);
      }

      if (!imageName || !imageSize) {
        await unlink(imageTempPath);
        reject({
          status: 500,
          message: "File not saved",
          error: err
        });
        return;
      }

      let ext = path.extname(imageName);
      let imageFullName = `${id}${ext}`;
      await rename(imageTempPath, path.join(uploadDir, imageFullName));

      let user = await User.findOneAndUpdate(
        { id },
        {
          image: `./images/avatars/${imageFullName}`
        }
      );

      resolve({
        path: path.join(uploadDir, imageFullName)
      });
    } catch (err) {
      reject(err);
    }
  });

exports.deleteUser = data =>
  new Promise(async (resolve, reject) => {
    const { id } = data;
    try {
      if (!id) {
        return reject("id is required");
      }
      await User.findOne({ id }).remove();

      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
