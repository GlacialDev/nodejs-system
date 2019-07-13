const mongoose = require("mongoose");
const bCrypt = require("bcryptjs");

const schema = new mongoose.Schema(
  {
    id: {
      type: String
    },
    access_token: {
      type: String
    },
    username: {
      type: String,
      required: [true, "Username required"],
      unique: true
    },
    image: {
      type: String
    },
    permission: {
      chat: {
        C: Boolean,
        R: Boolean,
        U: Boolean,
        D: Boolean
      },
      news: {
        C: Boolean,
        R: Boolean,
        U: Boolean,
        D: Boolean
      },
      setting: {
        C: Boolean,
        R: Boolean,
        U: Boolean,
        D: Boolean
      }
    },
    permissionId: {
      type: String
    },
    surName: {
      type: String
    },
    firstName: {
      type: String
    },
    middleName: {
      type: String
    },
    password: {
      type: String,
      required: [true, "Hash password required"]
    },
    token: {
      type: String
    }
  },
  { versionKey: false }
);

schema.methods.setPassword = function(pass) {
  this.password = bCrypt.hashSync(pass, bCrypt.genSaltSync(10), null);
};

schema.methods.validPassword = function(pass) {
  return bCrypt.compareSync(pass, this.password);
};

schema.methods.setToken = function(token) {
  this.token = token;
};

module.exports = mongoose.model("User", schema);
