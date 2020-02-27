import userModel from "../models/userModel";
import passport from "passport";
import routes from "../routes";
//import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bookModel from "../models/bookModel";
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
  console.log(req.body);
  try {
    const user = await userModel.findByUsername(email);
    //console.log(location);
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
  try {
    const book = await bookModel.findOne({ isbn: isbn });
    const user = await userModel.findByUsername(email);
    //console.log(book, user);
    if (book) {
      if (user[type].indexOf(book._id) === -1) {
        if (type === "want_read") {
          if (user["reading"].indexOf(book.id) !== -1)
            user["reading"].splice(user["reading"].indexOf(book.id), 1);
          if (user["read"].indexOf(book.id) !== -1)
            user["read"].splice(user["read"].indexOf(book.id), 1);
        } else if (type === "reading") {
          if (user["read"].indexOf(book._id) !== -1)
            user["read"].splice(user["read"].indexOf(book.id), 1);
          if (user["want_read"].indexOf(book._id) !== -1)
            user["want_read"].splice(user["want_read"].indexOf(book.id), 1);
        } else if (type === "read") {
          if (user["reading"].indexOf(book._id) !== -1)
            user["reading"].splice(user["reading"].indexOf(book.id), 1);
          if (user["want_read"].indexOf(book._id) !== -1)
            user["want_read"].splice(user["want_read"].indexOf(book.id), 1);
        }
        user[type].push(book._id);
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
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};

export const postLike = async (req, res) => {
  const {
    body: { id, type }
  } = req;
  try {
    const review = await reviewModel.findById(id);
    if (type === "like") review.like += 1;
    else if (type === "unlike") review.unlike -= 1;
    review.save();
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).end();
  }
};
