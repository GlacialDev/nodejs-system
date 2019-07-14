const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    id: {
      type: String
    },
    text: {
      type: String
    },
    theme: {
      type: String
    },
    date: {
      type: String
    },
    user: {
      username: { type: String },
      password: { type: String },
      firstName: { type: String },
      middleName: { type: String },
      surName: { type: String },
      image: { type: String },
      access_token: { type: String },
      id: { type: String }
    }
  },
  { versionKey: false }
);

module.exports = mongoose.model("New", schema);
