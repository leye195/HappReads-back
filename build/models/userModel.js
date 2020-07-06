"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _passportLocalMongoose = _interopRequireDefault(require("passport-local-mongoose"));

var userSchema = _mongoose["default"].Schema({
  nickname: {
    type: String,
    "default": ""
  },
  email: {
    type: String
  },
  avatarUrl: {
    type: String,
    "default": "https://wetuberbucket.s3.ap-northeast-2.amazonaws.com/avatars/58c11a401956bab841de5f227c337c43"
  },
  githubId: Number,
  faceBookId: Number,
  intro: {
    type: String,
    "default": ""
  },
  interest: {
    type: String,
    "default": ""
  },
  website: {
    type: String,
    "default": ""
  },
  reviews: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Review"
  }],
  uploaded: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Book"
  }],
  votes: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Book"
  }],
  want_read: [{
    book: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Book"
    },
    createdAt: {
      type: Date,
      "default": new Date()
    }
  }],
  reading: [{
    book: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Book"
    },
    createdAt: {
      type: Date,
      "default": new Date()
    }
  }],
  read: [{
    book: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Book"
    },
    createdAt: {
      type: Date,
      "default": new Date()
    }
  }],
  likes: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Review"
  }]
});

userSchema.plugin(_passportLocalMongoose["default"], {
  usernameField: "email"
}); //plugin 추가

var userModel = _mongoose["default"].model("User", userSchema);

var _default = userModel;
exports["default"] = _default;