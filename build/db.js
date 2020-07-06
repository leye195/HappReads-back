"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

_mongoose["default"].connect(process.env.MONGO_URL_DEV, {
  useNewUrlParser: true,
  useFindAndModify: false
});

var db = _mongoose["default"].connection;

var handleOpen = function handleOpen() {
  console.log("Connect to MongoDB");
};

var handleError = function handleError(error) {
  console.log("Error on DB Connection: ".concat(error));
};

db.once("open", handleOpen);
db.on("error", handleError);