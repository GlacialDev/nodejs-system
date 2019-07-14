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
        C: {
          type: Boolean,
          default: true
        },
        R: {
          type: Boolean,
          default: true
        },
        U: {
          type: Boolean,
          default: true
        },
        D: {
          type: Boolean,
          default: true
        }
      },
      news: {
        C: {
          type: Boolean,
          default: true
        },
        R: {
          type: Boolean,
          default: true
        },
        U: {
          type: Boolean,
          default: true
        },
        D: {
          type: Boolean,
          default: true
        }
      },
      setting: {
        C: {
          type: Boolean,
          default: true
        },
        R: {
          type: Boolean,
          default: true
        },
        U: {
          type: Boolean,
          default: true
        },
        D: {
          type: Boolean,
          default: true
        }
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
