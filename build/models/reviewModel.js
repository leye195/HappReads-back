"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var reviewSchema = new _mongoose["default"].Schema({
  reviewer: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  book: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Book"
  },
  isbn: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    "default": Date.now
  },
  likes: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  }]
});

var reviewModel = _mongoose["default"].model("Review", reviewSchema);

var _default = reviewModel;
exports["default"] = _default;