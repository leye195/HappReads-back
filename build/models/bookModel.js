"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var bookSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: "title required"
  },
  contents: {
    type: String
  },
  thumbnail: {
    type: String,
    "default": "https://happreads.s3.ap-northeast-2.amazonaws.com/covers/placeholder-book-cover-default.png"
  },
  authors: [],
  genres: {
    type: String
  },
  isbn: {
    type: String
  },
  review: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Review"
  }],
  votes: [{
    vote: {
      type: String,
      "default": "0"
    },
    createdAt: {
      type: Date,
      "default": Date.now()
    },
    voter: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "User"
    }
  }],
  //[{vote point, user._id}
  createdAt: {
    type: Date,
    "default": Date.now()
  }
});

var bookModel = _mongoose["default"].model("Book", bookSchema);

var _default = bookModel;
exports["default"] = _default;