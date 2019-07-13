const New = require("../db/models/new");
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
      let id = uuidv4();
      let date = `${new Date()}`;

      const newNews = new New({
        ...data,
        id,
        date
      });

      const result = await newNews.save();

      resolve(result);
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

      const result = await newsPost.save();

      resolve(result);
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
