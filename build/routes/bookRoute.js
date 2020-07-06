"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _routes = _interopRequireDefault(require("../routes"));

var _bookController = require("../controllers/bookController");

var app = _express["default"].Router();

app.get("/search", _bookController.getBookSearch);
app.get("/sliders", _bookController.getSliderBooks);
app.post("".concat(_routes["default"].review, "/:rid"), _bookController.editReview);
app.get("/:id", _bookController.getBook);
app.post("/:id", _bookController.postRate);
app.get("/:id".concat(_routes["default"].review), _bookController.getReview);
app["delete"]("/:id".concat(_routes["default"].review, "/:rid"), _bookController.deleteReview);
app.post("/:id".concat(_routes["default"].review), _bookController.postReview);
var _default = app;
exports["default"] = _default;