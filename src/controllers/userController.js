import userModel from "../models/userModel";
import passport from "passport";
import routes from "../routes";
import dotenv from "dotenv";
import bookModel from "../models/bookModel";
import reviewModel from "../models/reviewModel";
import moment from "moment";
dotenv.config();
export const postLogin = passport.authenticate("local", {
  session: false, //won't save user in session
  failureRedirect: routes.loginfailure,
});

export const postSignUp = async (req, res) => {
  const {
    body: { email, password },
  } = req;
  console.log(email);
  try {
    const user = await userModel({ email });
    await userModel.register(user, password);
    res.status(200).json({ error: 0, success: 1 });
  } catch (error) {
    res.status(400).end();
  }
};
export const postLogout = async (req, res) => {
  req.logout();
  res.status(200).json({ loggedIn: 0, success: 1 });
};

export const getProfile = async (req, res) => {
  const {
    params: { id },
  } = req;

  try {
    const user = await userModel
      .findById(id)
      .populate("reading.book")
      .populate("read.book")
      .populate("want_read.book")
      .populate({
        path: "reviews",
        populate: { path: "book" },
      })
      .populate("uploaded");
    res.status(200).json({ error: 0, user: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
export const postProfile = passport.authenticate("jwt", { session: false });

export const postEdit = async (req, res) => {
  const {
    body: { email, nickname, intro, website, interest },
    file,
  } = req;
  try {
    const user = await userModel.findByUsername(email);
    if (req.file) user.avatarUrl = file.location;
    if (nickname) user.nickname = nickname;
    if (intro) user.intro = intro;
    if (website) user.website = website;
    if (interest) user.interest = interest;
    user.save();
    res.status(200).json({ error: 0 });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};

export const postShelve = async (req, res) => {
  const {
    body: { email, id, type },
  } = req;
  //console.log(email, id, type);
  try {
    const book = await bookModel.findById(id);
    const user = await userModel
      .findByUsername(email)
      .populate("reading.book")
      .populate("read.book")
      .populate("want_read.book")
      .populate({
        path: "reviews",
        populate: { path: "book" },
      })
      .populate("uploaded");
    if (book) {
      if (user[type].indexOf(book._id) === -1) {
        if (type === "want_read") {
          const reading = user["reading"].filter((item) => {
            return String(item.book._id) !== String(book._id);
          });
          const read = user["read"].filter((item) => {
            return String(item.book._id) !== String(book._id);
          });
          user["reading"] = reading;
          user["read"] = read;
        } else if (type === "reading") {
          const want_read = user["want_read"].filter((item) => {
            return String(item.book.id) !== String(book._id);
          });
          const read = user["read"].filter((item) => {
            return String(item.book.id) !== String(book._id);
          });
          user["read"] = read;
          user["want_read"] = want_read;
        } else if (type === "read") {
          const reading = user["reading"].filter((item) => {
            return String(item.book.id) !== String(book._id);
          });
          const want_read = user["want_read"].filter((item) => {
            return String(item.book.id) !== String(book._id);
          });
          user["reading"] = reading;
          user["want_read"] = want_read;
        }
        user[type].push({ book: book });
        //console.log(user[type]);
        user.save();
      }
    }
    res.status(200).json({ error: 0, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
export const deleteShelve = async (req, res) => {
  const {
    body: { uid, type, id },
  } = req;
  console.log();
  try {
    const user = await userModel
      .findById(uid)
      .populate("reading.book")
      .populate("read.book")
      .populate("want_read.book")
      .populate({
        path: "reviews",
        populate: { path: "book" },
      })
      .populate("uploaded");
    const newList = user[type].filter((item) => {
      return item.book !== null && String(item.book.id) !== String(id);
    });
    user[type] = newList;
    user.save();
    res.status(200).json({ error: 0, profile: user });
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
};
/**
 * POST /
 * @param {*} req
 * @param {*} res
 */
export const postLike = async (req, res) => {
  const {
    body: { id, type, uid, m_id }, // id->review._id ,u_id -> user._id, m_id: my._id
  } = req;
  console.log();
  try {
    const user = await userModel
      .findById(uid)
      .populate("reading.book")
      .populate("read.book")
      .populate("want_read.book")
      .populate({
        path: "reviews",
        populate: { path: "book" },
      })
      .populate("uploaded");
    const review = await reviewModel.findById(id);
    for (let i = 0; i < user.reviews.length; i++) {
      if (String(user.reviews[i]._id) === String(review._id)) {
        user.reviews[i].likes += 1;
        review.likes += 1;
        break;
      }
    }
    user.save();
    review.save();
    res.status(200).json({ error: 0, profile: user });
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
};
/**
 * GET /reviews
 * @param {*} req
 * @param {*} res
 */
export const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel
      .find()
      .populate("book")
      .populate("reviewer")
      .sort({ createdAt: -1 });
    res.status(200).json({ error: 0, reviews });
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 1 });
  }
};

export const getTopReaders = async (req, res) => {
  const {
    params: { type },
  } = req;
  try {
    if (parseInt(type) === 0) {
      const readers = await userModel.find().sort({ read: -1 }).limit(10);
      res.status(200).json({ error: 0, readers: readers });
    } else if (parseInt(type) === 1) {
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf("week");
      const weekEnd = currentDate.clone().endOf("week");
      console.log(weekStart.toDate(), weekEnd.toDate());
      const readers = await userModel.find({
        "read.createdAt": {
          $gte: weekStart.toDate(),
          $lte: weekEnd.toDate(),
        },
      });
      //console.log(readers);
      res.status(200).json({ error: 0, readers: readers });
    } else if (parseInt(type) === 2) {
      const start = moment().startOf("month");
      const end = moment().endOf("month");
      const readers = await userModel
        .find({
          "read.createdAt": { $gte: start.toDate(), $lte: end.toDate() },
        })
        .limit(10)
        .sort({ read: -1 });
      console.log(readers);
      res.status(200).json({ error: 0, readers: readers });
    } else {
      throw error("type should be between 0~2");
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 1 });
  }
};
export const getTopReviewers = async (req, res) => {
  const {
    params: { type },
  } = req;
  try {
    if (parseInt(type) === 0) {
      //all, 전체
      const reviewers = await userModel.find().sort({ reviews: -1 }).limit(10);
      res.status(200).json({ error: 0, reviewers });
    } else if (parseInt(type) === 1) {
      //this week, 이번주
      const currentDate = moment();
      const weekStart = currentDate.clone().startOf("week");
      const weekEnd = currentDate.clone().endOf("week");
      const reviewers = await userModel
        .find()
        .populate("reviews")
        .where("reviews.createdAt")
        .gte(weekStart.toDate())
        .lte(weekEnd.toDate())
        .sort({ reviews: -1 })
        .limit(10);
      res.status(200).json({ error: 0, reviewers });
    } else if (parseInt(type) === 2) {
      //this month, 이번달
      const start = moment().startOf("month");
      const end = moment().endOf("month");
      const reviewers = await userModel
        .find()
        .populate("reviews")
        .where("reviews.createdAt")
        .gte(start.toDate())
        .lte(end.toDate())
        .sort({ reviews: -1 })
        .limit(10);
      res.status(200).json({ error: 0, reviewers });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: 1 });
  }
};
