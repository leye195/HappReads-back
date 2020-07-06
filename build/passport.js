"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = _interopRequireDefault(require("passport-jwt"));

var _userModel = _interopRequireDefault(require("./models/userModel"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var jwtStrategy = _passportJwt["default"].Strategy;
var extractJWT = _passportJwt["default"].ExtractJwt;

_passport["default"].use(_userModel["default"].createStrategy()); //passport.use(new LocalStrategy(User.authenticate()));


_passport["default"].use(new jwtStrategy({
  jwtFromRequest: extractJWT.fromAuthHeaderWithScheme("jwt"),
  secretOrKey: process.env.JWT_SECRET
},
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(jwtPayload, done) {
    var user;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!jwtPayload.user) {
              _context.next = 7;
              break;
            }

            _context.next = 3;
            return _userModel["default"].findById(jwtPayload.user._id).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded");

          case 3:
            user = _context.sent;
            return _context.abrupt("return", done(null, user));

          case 7:
            return _context.abrupt("return", done(null, false));

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}())); //use static serialize and deserializ of model for passport session support


_passport["default"].serializeUser(_userModel["default"].serializeUser()); //쿠키에 user.id를 저장


_passport["default"].deserializeUser(_userModel["default"].deserializeUser()); //id를 식별자로 db 데이터와 비교