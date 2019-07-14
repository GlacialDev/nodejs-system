const New = require("../db/models/new");
const User = require("../db/models/user");
const uuidv4 = require("uuid/v4");

exports.getNews = () =>
  new Promise(async (resolve, reject) => {
    try {
      let result = await New.find();

      resolve(result);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });

exports.newNews = data =>
  new Promise(async (resolve, reject) => {
    try {
      const { text, theme, date, userId } = data;
      let newsId = uuidv4();

      const user = await User.findOne({ id: userId });
      const {
        access_token,
        firstName,
        image,
        middleName,
        password,
        surName,
        username
      } = user;

      const newNews = new New({
        user: {
          access_token,
          firstName,
          id: userId,
          image,
          middleName,
          surName,
          password,
          username
        },
        id: newsId,
        text,
        theme,
        date
      });

      await newNews.save();

      const updatedNews = await New.find();

      resolve(updatedNews);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });

exports.updateNews = data =>
  new Promise(async (resolve, reject) => {
    const { id, theme, text } = {
      ...data
    };
    try {
      if (!id) {
        return reject("id is required");
      }

      let newsPost = await New.findOneAndUpdate(
        { id },
        {
          theme,
          text
        }
      );

      await newsPost.save();

      const updatedNews = await New.find();

      resolve(updatedNews);
    } catch (err) {
      reject({
        message: err,
        statusCode: 500
      });
    }
  });

exports.deleteNews = data =>
  new Promise(async (resolve, reject) => {
    const { id } = data;
    try {
      if (!id) {
        return reject("id is required");
      }
      await New.findOne({ id }).remove();

      const result = await New.find();

      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
