"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getTopReviewers = exports.getTopReaders = exports.getReviews = exports.postLike = exports.deleteShelve = exports.postShelve = exports.postEdit = exports.postProfile = exports.getProfile = exports.postLogout = exports.postSignUp = exports.postLogin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _userModel = _interopRequireDefault(require("../models/userModel"));

var _passport = _interopRequireDefault(require("passport"));

var _routes = _interopRequireDefault(require("../routes"));

var _bookModel = _interopRequireDefault(require("../models/bookModel"));

var _reviewModel = _interopRequireDefault(require("../models/reviewModel"));

var _moment = _interopRequireDefault(require("moment"));

var _dotenv = _interopRequireDefault(require("dotenv"));

require("@babel/polyfill");

_dotenv["default"].config();

var postLogin = _passport["default"].authenticate("local", {
  session: false,
  //won't save user in session
  failureRedirect: _routes["default"].loginfailure
});

exports.postLogin = postLogin;

var postSignUp =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var _req$body, email, password, user;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _req$body = req.body, email = _req$body.email, password = _req$body.password;
            _context.prev = 1;
            _context.next = 4;
            return (0, _userModel["default"])({
              email: email
            });

          case 4:
            user = _context.sent;
            _context.next = 7;
            return _userModel["default"].register(user, password);

          case 7:
            res.status(200).json({
              error: 0,
              success: 1
            });
            _context.next = 13;
            break;

          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](1);
            res.status(400).end();

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[1, 10]]);
  }));

  return function postSignUp(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.postSignUp = postSignUp;

var postLogout =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            req.logout();
            res.status(200).json({
              loggedIn: 0,
              success: 1
            });

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function postLogout(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.postLogout = postLogout;

var getProfile =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res) {
    var id, user;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            id = req.params.id;
            _context3.prev = 1;
            _context3.next = 4;
            return _userModel["default"].findById(id).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded");

          case 4:
            user = _context3.sent;
            res.status(200).json({
              error: 0,
              user: user
            });
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);
            res.status(400).json({
              error: 1
            });

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[1, 8]]);
  }));

  return function getProfile(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

exports.getProfile = getProfile;

var postProfile = _passport["default"].authenticate("jwt", {
  session: false
});

exports.postProfile = postProfile;

var postEdit =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res) {
    var _req$body2, email, nickname, intro, website, interest, file, user;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _req$body2 = req.body, email = _req$body2.email, nickname = _req$body2.nickname, intro = _req$body2.intro, website = _req$body2.website, interest = _req$body2.interest, file = req.file;
            _context4.prev = 1;
            _context4.next = 4;
            return _userModel["default"].findByUsername(email);

          case 4:
            user = _context4.sent;
            if (req.file) user.avatarUrl = file.location;
            if (nickname) user.nickname = nickname;
            if (intro) user.intro = intro;
            if (website) user.website = website;
            if (interest) user.interest = interest;
            user.save();
            res.status(200).json({
              error: 0
            });
            _context4.next = 17;
            break;

          case 14:
            _context4.prev = 14;
            _context4.t0 = _context4["catch"](1);
            res.status(400).json({
              error: 1
            });

          case 17:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[1, 14]]);
  }));

  return function postEdit(_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}();

exports.postEdit = postEdit;

var postShelve =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res) {
    var _req$body3, email, id, type, book, user, checkList, reading, read, want_read, _read, _reading, _want_read;

    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _req$body3 = req.body, email = _req$body3.email, id = _req$body3.id, type = _req$body3.type;
            console.log(email, id, type);
            _context5.prev = 2;
            _context5.next = 5;
            return _bookModel["default"].findById(id);

          case 5:
            book = _context5.sent;
            _context5.next = 8;
            return _userModel["default"].findByUsername(email).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded");

          case 8:
            user = _context5.sent;

            if (book) {
              checkList = user[type].filter(function (item) {
                return String(item.book._id) === String(book._id);
              });

              if (checkList.length === 0) {
                if (type === "want_read") {
                  reading = user["reading"].filter(function (item) {
                    return String(item.book._id) !== String(book._id);
                  });
                  read = user["read"].filter(function (item) {
                    return String(item.book._id) !== String(book._id);
                  });
                  user["reading"] = reading;
                  user["read"] = read;
                } else if (type === "reading") {
                  want_read = user["want_read"].filter(function (item) {
                    return String(item.book.id) !== String(book._id);
                  });
                  _read = user["read"].filter(function (item) {
                    return String(item.book.id) !== String(book._id);
                  });
                  user["read"] = _read;
                  user["want_read"] = want_read;
                } else if (type === "read") {
                  _reading = user["reading"].filter(function (item) {
                    return String(item.book.id) !== String(book._id);
                  });
                  _want_read = user["want_read"].filter(function (item) {
                    return String(item.book.id) !== String(book._id);
                  });
                  user["reading"] = _reading;
                  user["want_read"] = _want_read;
                }

                user[type].push({
                  book: book
                });
                user.save();
              }
            }

            res.status(200).json({
              error: 0,
              user: user
            });
            _context5.next = 17;
            break;

          case 13:
            _context5.prev = 13;
            _context5.t0 = _context5["catch"](2);
            console.log(_context5.t0);
            res.status(400).json({
              error: 1
            });

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[2, 13]]);
  }));

  return function postShelve(_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}();

exports.postShelve = postShelve;

var deleteShelve =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res) {
    var _req$body4, uid, type, id, user, newList;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _req$body4 = req.body, uid = _req$body4.uid, type = _req$body4.type, id = _req$body4.id;
            console.log(uid, type, id);
            _context6.prev = 2;
            _context6.next = 5;
            return _userModel["default"].findById(uid).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded");

          case 5:
            user = _context6.sent;
            newList = user[type].filter(function (item) {
              return item.book !== null && String(item._id) !== String(id);
            });
            user[type] = newList;
            user.save();
            res.status(200).json({
              error: 0,
              user: user
            });
            _context6.next = 16;
            break;

          case 12:
            _context6.prev = 12;
            _context6.t0 = _context6["catch"](2);
            console.log(_context6.t0);
            res.status(400).end();

          case 16:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[2, 12]]);
  }));

  return function deleteShelve(_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * POST /
 * @param {*} req
 * @param {*} res
 */


exports.deleteShelve = deleteShelve;

var postLike =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(req, res) {
    var _req$body5, id, type, uid, user, review, idx, i;

    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _req$body5 = req.body, id = _req$body5.id, type = _req$body5.type, uid = _req$body5.uid;
            console.log(req.body);
            _context7.prev = 2;
            _context7.next = 5;
            return _userModel["default"].findById(uid).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded").populate("likes");

          case 5:
            user = _context7.sent;
            _context7.next = 8;
            return _reviewModel["default"].findById(id).populate("reviewer").populate("likes");

          case 8:
            review = _context7.sent;
            idx = -1; //toggle like review

            i = 0;

          case 11:
            if (!(i < review.likes.length)) {
              _context7.next = 18;
              break;
            }

            if (!(String(review.likes[i]._id) === String(user._id))) {
              _context7.next = 15;
              break;
            }

            idx = i;
            return _context7.abrupt("break", 18);

          case 15:
            i++;
            _context7.next = 11;
            break;

          case 18:
            if (idx !== -1) {
              //cancel like review
              review.likes.splice(idx, 1);
            } else {
              //like review
              review.likes.push(user);
            }

            user.save();
            review.save();
            res.status(200).json({
              error: 0,
              review: review
            });
            _context7.next = 28;
            break;

          case 24:
            _context7.prev = 24;
            _context7.t0 = _context7["catch"](2);
            console.log(_context7.t0);
            res.status(400).end();

          case 28:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[2, 24]]);
  }));

  return function postLike(_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * GET /reviews
 * @param {*} req
 * @param {*} res
 */


exports.postLike = postLike;

var getReviews =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(req, res) {
    var _req$query, limit, page, reviews;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.prev = 0;
            _req$query = req.query, limit = _req$query.limit, page = _req$query.page;
            console.log(page, limit, page * limit);
            _context8.next = 5;
            return _reviewModel["default"].find().populate("book").populate("reviewer").sort({
              createdAt: -1
            }).skip(parseInt(limit) * (parseInt(page) - 1)).limit(parseInt(limit));

          case 5:
            reviews = _context8.sent;
            console.log(reviews.length);
            res.status(200).json({
              error: 0,
              reviews: reviews
            });
            _context8.next = 14;
            break;

          case 10:
            _context8.prev = 10;
            _context8.t0 = _context8["catch"](0);
            console.log(_context8.t0);
            res.status(404).json({
              error: 1
            });

          case 14:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[0, 10]]);
  }));

  return function getReviews(_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}();

exports.getReviews = getReviews;

var getTopReaders =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(req, res) {
    var type, readers, currentDate, weekStart, weekEnd, _readers, start, end, _readers2;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            type = req.params.type;
            _context9.prev = 1;

            if (!(parseInt(type) === 0)) {
              _context9.next = 9;
              break;
            }

            _context9.next = 5;
            return _userModel["default"].find().sort({
              read: -1
            }).limit(10);

          case 5:
            readers = _context9.sent;
            res.status(200).json({
              error: 0,
              readers: readers
            });
            _context9.next = 31;
            break;

          case 9:
            if (!(parseInt(type) === 1)) {
              _context9.next = 20;
              break;
            }

            currentDate = (0, _moment["default"])();
            weekStart = currentDate.clone().startOf("week");
            weekEnd = currentDate.clone().endOf("week");
            console.log(weekStart.toDate(), weekEnd.toDate());
            _context9.next = 16;
            return _userModel["default"].find({
              "read.createdAt": {
                $gte: weekStart.toDate(),
                $lte: weekEnd.toDate()
              }
            });

          case 16:
            _readers = _context9.sent;
            //console.log(readers);
            res.status(200).json({
              error: 0,
              readers: _readers
            });
            _context9.next = 31;
            break;

          case 20:
            if (!(parseInt(type) === 2)) {
              _context9.next = 30;
              break;
            }

            start = (0, _moment["default"])().startOf("month");
            end = (0, _moment["default"])().endOf("month");
            _context9.next = 25;
            return _userModel["default"].find({
              "read.createdAt": {
                $gte: start.toDate(),
                $lte: end.toDate()
              }
            }).limit(10).sort({
              read: -1
            });

          case 25:
            _readers2 = _context9.sent;
            console.log(_readers2);
            res.status(200).json({
              error: 0,
              readers: _readers2
            });
            _context9.next = 31;
            break;

          case 30:
            throw error("type should be between 0~2");

          case 31:
            _context9.next = 37;
            break;

          case 33:
            _context9.prev = 33;
            _context9.t0 = _context9["catch"](1);
            console.log(_context9.t0);
            res.status(404).json({
              error: 1
            });

          case 37:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 33]]);
  }));

  return function getTopReaders(_x17, _x18) {
    return _ref9.apply(this, arguments);
  };
}();

exports.getTopReaders = getTopReaders;

var getTopReviewers =
/*#__PURE__*/
function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(req, res) {
    var type, reviewers, currentDate, weekStart, weekEnd, _reviewers, start, end, _reviewers2;

    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            type = req.params.type;
            _context10.prev = 1;

            if (!(parseInt(type) === 0)) {
              _context10.next = 9;
              break;
            }

            _context10.next = 5;
            return _userModel["default"].find().sort({
              reviews: -1
            }).limit(10);

          case 5:
            reviewers = _context10.sent;
            res.status(200).json({
              error: 0,
              reviewers: reviewers
            });
            _context10.next = 26;
            break;

          case 9:
            if (!(parseInt(type) === 1)) {
              _context10.next = 19;
              break;
            }

            //this week, 이번주
            currentDate = (0, _moment["default"])();
            weekStart = currentDate.clone().startOf("week");
            weekEnd = currentDate.clone().endOf("week");
            _context10.next = 15;
            return _userModel["default"].find().populate("reviews").where("reviews.createdAt").gte(weekStart.toDate()).lte(weekEnd.toDate()).sort({
              reviews: -1
            }).limit(10);

          case 15:
            _reviewers = _context10.sent;
            res.status(200).json({
              error: 0,
              reviewers: _reviewers
            });
            _context10.next = 26;
            break;

          case 19:
            if (!(parseInt(type) === 2)) {
              _context10.next = 26;
              break;
            }

            //this month, 이번달
            start = (0, _moment["default"])().startOf("month");
            end = (0, _moment["default"])().endOf("month");
            _context10.next = 24;
            return _userModel["default"].find().populate("reviews").where("reviews.createdAt").gte(start.toDate()).lte(end.toDate()).sort({
              reviews: -1
            }).limit(10);

          case 24:
            _reviewers2 = _context10.sent;
            res.status(200).json({
              error: 0,
              reviewers: _reviewers2
            });

          case 26:
            _context10.next = 32;
            break;

          case 28:
            _context10.prev = 28;
            _context10.t0 = _context10["catch"](1);
            console.log(_context10.t0);
            res.status(404).json({
              error: 1
            });

          case 32:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 28]]);
  }));

  return function getTopReviewers(_x19, _x20) {
    return _ref10.apply(this, arguments);
  };
}();

exports.getTopReviewers = getTopReviewers;