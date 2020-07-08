"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.editReview = exports.deleteReview = exports.postReview = exports.getReview = exports.postRate = exports.postBook = exports.getBook = exports.getBookSearch = exports.getRecentBooks = exports.getPopularBooks = exports.getSliderBooks = exports.editBook = exports.getBooks = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _reviewModel = _interopRequireDefault(require("../models/reviewModel"));

var _bookModel = _interopRequireDefault(require("../models/bookModel"));

var _userModel = _interopRequireDefault(require("../models/userModel"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

/**
 * GET /books/:type?page={page}
 * @param {*} req
 * @param {*} res
 */
var getBooks =
/*#__PURE__*/
function () {
  var _ref = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee(req, res) {
    var type, page, books;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            type = req.params.type, page = req.query.page;
            books = [];

            if (!(type === "전체")) {
              _context.next = 9;
              break;
            }

            _context.next = 6;
            return _bookModel["default"].find().sort({
              _id: -1
            }).skip((parseInt(page, 10) - 1) * 15).limit(15);

          case 6:
            books = _context.sent;
            _context.next = 12;
            break;

          case 9:
            _context.next = 11;
            return _bookModel["default"].find({
              genres: {
                $regex: type
              }
            }).sort({
              _id: -1
            }).skip((parseInt(page, 10) - 1) * 15).limit(15);

          case 11:
            books = _context.sent;

          case 12:
            res.status(200).json({
              error: 0,
              books: books,
              page: parseInt(page, 10)
            });
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context["catch"](0);
            res.status(400).json({
              error: 1
            });

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, null, [[0, 15]]);
  }));

  return function getBooks(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * PUT /book/:id
 * @param {*} req
 * @param {*} res
 */


exports.getBooks = getBooks;

var editBook =
/*#__PURE__*/
function () {
  var _ref2 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2(req, res, next) {
    var _req$body, title, contents, genres, id;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _req$body = req.body, title = _req$body.title, contents = _req$body.contents, genres = _req$body.genres, id = req.params.id;
            _context2.next = 4;
            return _bookModel["default"].findByIdAndUpdate(id, {
              title: title,
              contents: contents,
              genres: genres
            });

          case 4:
            res.status(200).end();
            _context2.next = 10;
            break;

          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 10:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 7]]);
  }));

  return function editBook(_x3, _x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}();
/*
 *GET /sliders
 * @param {*} req
 * @param {*} res
 */


exports.editBook = editBook;

var getSliderBooks =
/*#__PURE__*/
function () {
  var _ref3 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3(req, res, next) {
    var books, sliderBooks, book;
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _bookModel["default"].find();

          case 3:
            books = _context3.sent;
            sliderBooks = [];

            while (sliderBooks.length !== 8) {
              book = books[books.length * Math.random() | 0];
              if (!sliderBooks.includes(book)) sliderBooks.push(book);
            }

            res.status(200).json({
              books: sliderBooks
            });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 9]]);
  }));

  return function getSliderBooks(_x6, _x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}();
/*
 *GET /popular
 * @param {*} req
 * @param {*} res
 */


exports.getSliderBooks = getSliderBooks;

var getPopularBooks =
/*#__PURE__*/
function () {
  var _ref4 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4(req, res, next) {
    var books, newBooks;
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _bookModel["default"].find().populate({
              path: "votes.voter"
            });

          case 3:
            books = _context4.sent;
            newBooks = books.filter(function (book) {
              return book.votes.length >= 1;
            }) //최소 한번은 평가 되어야 들어감
            .map(function (book) {
              return _objectSpread({}, book._doc, {
                avg_vote: book.votes && book.votes.length > 0 ? (book.votes.reduce(function (x, y) {
                  return x + parseFloat(y.vote);
                }, 0) / book.votes.length).toFixed(2) : 0
              });
            }).sort(function (x, y) {
              return y.avg_vote - x.avg_vote;
            });
            res.status(200).json(newBooks);
            _context4.next = 11;
            break;

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, null, [[0, 8]]);
  }));

  return function getPopularBooks(_x9, _x10, _x11) {
    return _ref4.apply(this, arguments);
  };
}();
/*
 *GET /recent
 * @param {*} req
 * @param {*} res
 */


exports.getPopularBooks = getPopularBooks;

var getRecentBooks =
/*#__PURE__*/
function () {
  var _ref5 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5(req, res, next) {
    var books;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return _bookModel["default"].find().sort({
              createdAt: -1
            });

          case 3:
            books = _context5.sent;
            res.status(200).json(books);
            _context5.next = 10;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, null, [[0, 7]]);
  }));

  return function getRecentBooks(_x12, _x13, _x14) {
    return _ref5.apply(this, arguments);
  };
}();
/*
 *GET /search?q={q}&type={type}
 * @param {*} req
 * @param {*} res
 */


exports.getRecentBooks = getRecentBooks;

var getBookSearch =
/*#__PURE__*/
function () {
  var _ref6 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee6(req, res) {
    var _req$query, q, type, books;

    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _req$query = req.query, q = _req$query.q, type = _req$query.type;
            books = [];

            if (!(parseInt(type) === 0)) {
              _context6.next = 9;
              break;
            }

            _context6.next = 6;
            return _bookModel["default"].find().or([{
              title: {
                $regex: q
              }
            }, {
              authors: {
                $regex: q
              }
            }]);

          case 6:
            books = _context6.sent;
            _context6.next = 19;
            break;

          case 9:
            if (!(parseInt(type) === 1)) {
              _context6.next = 15;
              break;
            }

            _context6.next = 12;
            return _bookModel["default"].find({
              title: {
                $regex: q
              }
            });

          case 12:
            books = _context6.sent;
            _context6.next = 19;
            break;

          case 15:
            if (!(parseInt(type) === 2)) {
              _context6.next = 19;
              break;
            }

            _context6.next = 18;
            return _bookModel["default"].find({
              authors: {
                $regex: q
              }
            });

          case 18:
            books = _context6.sent;

          case 19:
            console.log(books);
            res.json({
              books: books,
              error: 0
            });
            _context6.next = 26;
            break;

          case 23:
            _context6.prev = 23;
            _context6.t0 = _context6["catch"](0);
            res.json({
              books: [],
              error: 1
            });

          case 26:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, null, [[0, 23]]);
  }));

  return function getBookSearch(_x15, _x16) {
    return _ref6.apply(this, arguments);
  };
}();
/**
 * GET /book/:id
 * @param {*} req
 * @param {*} res
 */


exports.getBookSearch = getBookSearch;

var getBook =
/*#__PURE__*/
function () {
  var _ref7 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee7(req, res) {
    var id, book;
    return _regenerator["default"].wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = req.params.id;
            _context7.prev = 1;
            _context7.next = 4;
            return _bookModel["default"].findById(id).populate({
              path: "review",
              populate: {
                path: "reviewer",
                model: _userModel["default"]
              }
            }).populate({
              path: "votes.voter"
            });

          case 4:
            book = _context7.sent;
            if (book) res.status(200).json({
              error: 0,
              book: book
              /*,reviews: book.review, votes: book.votes*/

            });else res.status(200).json({
              error: 0
            });
            _context7.next = 11;
            break;

          case 8:
            _context7.prev = 8;
            _context7.t0 = _context7["catch"](1);
            res.status(400).json({
              error: 1
            });

          case 11:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7, null, [[1, 8]]);
  }));

  return function getBook(_x17, _x18) {
    return _ref7.apply(this, arguments);
  };
}();
/**
 * POST /upload
 */


exports.getBook = getBook;

var postBook =
/*#__PURE__*/
function () {
  var _ref8 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee8(req, res) {
    var _req$body2, title, authors, contents, uid, genres, file, book, user;

    return _regenerator["default"].wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _req$body2 = req.body, title = _req$body2.title, authors = _req$body2.authors, contents = _req$body2.contents, uid = _req$body2.uid, genres = _req$body2.genres, file = req.file; //console.log(file);

            _context8.prev = 1;
            book = new _bookModel["default"]();
            _context8.next = 5;
            return _userModel["default"].findById(uid);

          case 5:
            user = _context8.sent;
            book.title = title;
            book.authors.push(authors);
            book.contents = contents;
            book.thumbnail = file.location; //book.thunbnail=thumbnail;

            book.genres = genres;
            book.save();
            user.uploaded.push(book.id);
            user.save();
            res.status(200).json({
              error: 0
            });
            _context8.next = 21;
            break;

          case 17:
            _context8.prev = 17;
            _context8.t0 = _context8["catch"](1);
            console.log(_context8.t0);
            res.status(400).json({
              error: 1
            });

          case 21:
          case "end":
            return _context8.stop();
        }
      }
    }, _callee8, null, [[1, 17]]);
  }));

  return function postBook(_x19, _x20) {
    return _ref8.apply(this, arguments);
  };
}();
/**
 * POST /book/:id
 * @param {*} req
 * @param {*} res
 */


exports.postBook = postBook;

var postRate =
/*#__PURE__*/
function () {
  var _ref9 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee9(req, res) {
    var _req$body3, vote, name, id, user, book, idx, i;

    return _regenerator["default"].wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _req$body3 = req.body, vote = _req$body3.vote, name = _req$body3.name, id = req.params.id; //console.log(id, vote, name);

            _context9.prev = 1;
            _context9.next = 4;
            return _userModel["default"].findByUsername(name);

          case 4:
            user = _context9.sent;
            _context9.next = 7;
            return _bookModel["default"].findById(id).populate({
              path: "votes.voter"
            });

          case 7:
            book = _context9.sent;

            if (!(book !== null)) {
              _context9.next = 27;
              break;
            }

            if (!(book.votes.length > 0)) {
              _context9.next = 21;
              break;
            }

            idx = -1;
            i = 0;

          case 12:
            if (!(i < book.votes.length)) {
              _context9.next = 20;
              break;
            }

            if (!(String(book.votes[i].voter._id) === String(user._id))) {
              _context9.next = 17;
              break;
            }

            idx = i;
            console.log(idx);
            return _context9.abrupt("break", 20);

          case 17:
            i++;
            _context9.next = 12;
            break;

          case 20:
            if (idx !== -1) book.votes.splice(idx, 1); //유저가 예전에 이미 평점을 부여했을 경우 전에 부여했던 기록을 지우고 새로운 평가 점수를 추가

          case 21:
            book.votes.push({
              vote: vote,
              voter: user
            }); //{vote point, user._id}

            book.save();
            user.votes.push(book.id);
            user.save();
            console.log(book);
            res.status(200).json({
              error: 0,
              book: book
            });

          case 27:
            _context9.next = 33;
            break;

          case 29:
            _context9.prev = 29;
            _context9.t0 = _context9["catch"](1);
            console.log(_context9.t0);
            res.status(400).json({
              error: 1
            });

          case 33:
          case "end":
            return _context9.stop();
        }
      }
    }, _callee9, null, [[1, 29]]);
  }));

  return function postRate(_x21, _x22) {
    return _ref9.apply(this, arguments);
  };
}();
/**
 * GET /books/:id/review
 * @param {*} req
 * @param {*} res
 */


exports.postRate = postRate;

var getReview =
/*#__PURE__*/
function () {
  var _ref10 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(req, res) {
    var id, reviews;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            id = req.params.id;
            _context10.prev = 1;
            _context10.next = 4;
            return _reviewModel["default"].find({
              book: id
            }).populate("reviewer").populate("book");

          case 4:
            reviews = _context10.sent;
            res.status(200).json({
              error: 0,
              reviews: reviews
            });
            _context10.next = 11;
            break;

          case 8:
            _context10.prev = 8;
            _context10.t0 = _context10["catch"](1);
            res.status(400).json({
              error: 1
            });

          case 11:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10, null, [[1, 8]]);
  }));

  return function getReview(_x23, _x24) {
    return _ref10.apply(this, arguments);
  };
}();
/**
 * POST /books/:id/review
 * @param {*} req
 * @param {*} res
 */


exports.getReview = getReview;

var postReview =
/*#__PURE__*/
function () {
  var _ref11 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee11(req, res) {
    var _req$body4, name, content, info, user, book, newReview;

    return _regenerator["default"].wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            _req$body4 = req.body, name = _req$body4.name, content = _req$body4.content, info = _req$body4.book;
            _context11.prev = 1;
            _context11.next = 4;
            return _userModel["default"].findByUsername(name);

          case 4:
            user = _context11.sent;
            _context11.next = 7;
            return _bookModel["default"].findById(info._id).populate({
              path: "review",
              populate: {
                path: "reviewer"
              }
            });

          case 7:
            book = _context11.sent;
            newReview = new _reviewModel["default"]({
              content: content,
              isbn: book.isbn,
              book: book.id,
              reviewer: user.id
            });
            newReview.save();
            user.reviews.push(newReview.id);
            user.save();
            book.review.push(newReview.id);
            book.save();
            _context11.next = 16;
            return newReview.populate("reviewer").execPopulate();

          case 16:
            newReview = _context11.sent;
            //console.log(newReview);
            res.status(200).json({
              error: 0,
              reviews: [].concat((0, _toConsumableArray2["default"])(book.review.splice(0, book.review.length - 1)), [newReview])
            });
            _context11.next = 24;
            break;

          case 20:
            _context11.prev = 20;
            _context11.t0 = _context11["catch"](1);
            console.log(_context11.t0);
            res.status(400).json({
              error: 1
            });

          case 24:
          case "end":
            return _context11.stop();
        }
      }
    }, _callee11, null, [[1, 20]]);
  }));

  return function postReview(_x25, _x26) {
    return _ref11.apply(this, arguments);
  };
}();
/**
 * DELETE books/:id/review/:rid
 * @param {*} req
 * @param {*} res
 */


exports.postReview = postReview;

var deleteReview =
/*#__PURE__*/
function () {
  var _ref12 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee12(req, res, next) {
    var _req$params, id, rid, uid, book, user, cleanedBookReviews, cleanedReviews;

    return _regenerator["default"].wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _req$params = req.params, id = _req$params.id, rid = _req$params.rid, uid = req.body.uid;
            _context12.prev = 1;
            console.log(uid, id, rid);

            if (!(id && uid && rid)) {
              _context12.next = 22;
              break;
            }

            _context12.next = 6;
            return _reviewModel["default"].findByIdAndDelete(rid);

          case 6:
            _context12.next = 8;
            return _bookModel["default"].findById(id).populate("review");

          case 8:
            book = _context12.sent;
            _context12.next = 11;
            return _userModel["default"].findById(uid).populate("reading.book").populate("read.book").populate("want_read.book").populate({
              path: "reviews",
              populate: {
                path: "book"
              }
            }).populate("uploaded").populate("likes");

          case 11:
            user = _context12.sent;
            cleanedBookReviews = book.review.filter(function (review) {
              return String(review.id) !== String(rid);
            });
            cleanedReviews = user.reviews.filter(function (review) {
              return String(review.id) !== String(rid);
            }); //console.log(cleanedBookReviews, cleanedReviews);

            book.review = cleanedBookReviews;
            user.reviews = cleanedReviews;
            book.save();
            user.save();
            console.log(user);
            res.status(200).json({
              error: 0,
              user: user
            });
            _context12.next = 23;
            break;

          case 22:
            res.status(403).end();

          case 23:
            _context12.next = 29;
            break;

          case 25:
            _context12.prev = 25;
            _context12.t0 = _context12["catch"](1);
            console.log(_context12.t0);
            next(_context12.t0);

          case 29:
          case "end":
            return _context12.stop();
        }
      }
    }, _callee12, null, [[1, 25]]);
  }));

  return function deleteReview(_x27, _x28, _x29) {
    return _ref12.apply(this, arguments);
  };
}();

exports.deleteReview = deleteReview;

var editReview =
/*#__PURE__*/
function () {
  var _ref13 = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee13(req, res) {
    var rid, content, review;
    return _regenerator["default"].wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            rid = req.params.rid, content = req.body.content;
            _context13.prev = 1;
            _context13.next = 4;
            return _reviewModel["default"].findByIdAndUpdate(rid, {
              content: content
            });

          case 4:
            review = _context13.sent;
            res.status(200).json({
              error: 0
            });
            _context13.next = 12;
            break;

          case 8:
            _context13.prev = 8;
            _context13.t0 = _context13["catch"](1);
            console.log(_context13.t0);
            res.status(400).json({
              error: 1
            });

          case 12:
          case "end":
            return _context13.stop();
        }
      }
    }, _callee13, null, [[1, 8]]);
  }));

  return function editReview(_x30, _x31) {
    return _ref13.apply(this, arguments);
  };
}();

exports.editReview = editReview;