"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

require("./db");

var _cors = _interopRequireDefault(require("cors"));

var _helmet = _interopRequireDefault(require("helmet"));

var _morgan = _interopRequireDefault(require("morgan"));

var _routes = _interopRequireDefault(require("./routes"));

var _globalRoute = _interopRequireDefault(require("./routes/globalRoute"));

var _bookRoute = _interopRequireDefault(require("./routes/bookRoute"));

var _passport = _interopRequireDefault(require("passport"));

var _dotenv = _interopRequireDefault(require("dotenv"));

require("./passport");

_dotenv["default"].config();

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use((0, _helmet["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded({
  extended: false
}));
app.use((0, _morgan["default"])("dev"));
app.use(_passport["default"].initialize());
app.use(_routes["default"].home, _globalRoute["default"]);
app.use(_routes["default"].book, _bookRoute["default"]);
app.listen(8080, function () {
  console.log("listening on port 8080");
});