import userModel from "../models/userModel";
import passport from "passport";
import routes from "../routes";
import dotenv from "dotenv";
import bookModel from "../models/bookModel";
import reviewModel from "../models/reviewModel";
dotenv.config();
export const postLogin = passport.authenticate("local", {
  session: false, //won't save user in session
  failureRedirect: routes.loginfailure
});

export const postSignUp = async (req, res) => {
  const {
    body: { email, password }
  } = req;
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
    params: { id }
  } = req;
  //console.log(id);
  try {
    const user = await userModel
      .findById(id)
      .populate("reading")
      .populate("read")
      .populate("want_read")
      .populate({
        path: "reviews",
        populate: { path: "book" }
      })
      .populate("uploaded");
    res.status(200).json({ error: 0, user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
export const postProfile = passport.authenticate("jwt", { session: false });

export const postEdit = async (req, res) => {
  const {
    body: { email, nickname, intro, website, interest },
    file
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
    body: { email, isbn, title, authors, type }
  } = req;
  console.log(email);
  try {
    const book = await bookModel.findOne({ isbn: isbn });
    const user = await userModel
      .findByUsername(email)
      .populate("reading")
      .populate("read")
      .populate("want_read")
      .populate({
        path: "reviews",
        populate: { path: "book" }
      })
      .populate("uploaded");
    if (book) {
      if (user[type].indexOf(book._id) === -1) {
        if (type === "want_read") {
          const reading = user["reading"].filter(item => {
            return String(item._id) !== String(book._id);
          });
          const read = user["read"].filter(item => {
            return String(item._id) !== String(book._id);
          });
          user["reading"] = reading;
          user["read"] = read;
        } else if (type === "reading") {
          const want_read = user["want_read"].filter(item => {
            return String(item.id) !== String(book._id);
          });
          const read = user["read"].filter(item => {
            return String(item.id) !== String(book._id);
          });
          user["read"] = read;
          user["want_read"] = want_read;
        } else if (type === "read") {
          const reading = user["reading"].filter(item => {
            return String(item.id) !== String(book._id);
          });
          const want_read = user["want_read"].filter(item => {
            return String(item.id) !== String(book._id);
          });
          user["reading"] = reading;
          user["want_read"] = want_read;
        }
        user[type].push(book);
        user.save();
      }
    } else {
      const newBook = new bookModel();
      newBook.title = title;
      newBook.isbn = isbn;
      newBook.authors = authors;
      newBook.save();
      user[type].push(newBook._id);
      user.save();
    }
    res.status(200).json({ error: 0, profile: user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
export const deleteShelve = async (req, res) => {
  const {
    body: { uid, type },
    params: { id }
  } = req;
  try {
    const user = await userModel
      .findById(uid)
      .populate("reading")
      .populate("read")
      .populate("want_read")
      .populate({
        path: "reviews",
        populate: { path: "book" }
      })
      .populate("uploaded");
    const newList = user[type].filter(item => {
      return String(item.id) !== String(id);
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
 *
 * @param {*} req
 * @param {*} res
 */
export const postLike = async (req, res) => {
  const {
    body: { id, type, uid, m_id } // id->review._id ,u_id -> user._id, m_id: my._id
  } = req;
  console.log();
  try {
    const user = await userModel
      .findById(uid)
      .populate("reading")
      .populate("read")
      .populate("want_read")
      .populate({
        path: "reviews",
        populate: { path: "book" }
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
