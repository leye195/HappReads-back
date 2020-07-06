"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("../routes"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _userController = require("../controllers/userController");

var _middlewares = require("../middlewares");

var _bookController = require("../controllers/bookController");

var app = _express["default"].Router();

app.get("".concat(_routes["default"].books, "/type/:type"), _bookController.getBooks);
app.get("".concat(_routes["default"].books, "/recent"), _bookController.getRecentBooks);
app.get("".concat(_routes["default"].books, "/popular"), _bookController.getPopularBooks);
app.get(_routes["default"].reviews, _userController.getReviews);
app.post(_routes["default"].login, _userController.postLogin, function (req, res) {
  var user = req.user;

  var token = _jsonwebtoken["default"].sign({
    user: user
  }, process.env.JWT_SECRET);

  res.status(200).json({
    loggedIn: 1,
    user: user,
    token: "jwt " + token
  });
});
app.get(_routes["default"].loginfailure, function (req, res) {
  res.status(404).json({
    loggedIn: 0
  });
});
app.post(_routes["default"].signup, _userController.postSignUp);
app.post(_routes["default"].logout, _userController.postLogout);
app.get("".concat(_routes["default"].profile, "/:id"), _userController.getProfile);
app.post(_routes["default"].profile, _userController.postProfile, function (req, res) {
  var user = req.user;
  res.status(200).json({
    user: user
  });
});
app.post(_routes["default"].edit, _middlewares.uploadAvatarMiddleware, _userController.postEdit);
app.post(_routes["default"].shelve, _userController.postShelve);
app["delete"](_routes["default"].shelve, _userController.deleteShelve);
app.post(_routes["default"].upload, _middlewares.uploadCoverMiddleware, _bookController.postBook);
app.post("".concat(_routes["default"].review, "/like"), _userController.postLike);
app.get("".concat(_routes["default"].rank, "/reader/:type"), _userController.getTopReaders);
app.get("".concat(_routes["default"].rank, "/reviewer/:type"), _userController.getTopReviewers);
var _default = app;
exports["default"] = _default;