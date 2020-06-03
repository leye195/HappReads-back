import express from "express";
import routes from "../routes";
import jwt from "jsonwebtoken";
import {
  postSignUp,
  postLogin,
  postProfile,
  postLogout,
  postEdit,
  postShelve,
  getProfile,
  postLike,
  deleteShelve,
  getReviews,
  getTopReaders,
  getTopReviewers,
} from "../controllers/userController";
import { uploadAvatarMiddleware, uploadCoverMiddleware } from "../middlewares";
import {
  postBook,
  getBooks,
  getBookSearch,
} from "../controllers/bookController";
const app = express.Router();

app.get(routes.books, getBooks);
app.get(routes.books + `/search`, getBookSearch);

app.get(routes.reviews, getReviews);

app.post(routes.login, postLogin, (req, res) => {
  const { user } = req;
  const token = jwt.sign({ user }, process.env.JWT_SECRET);
  res.status(200).json({ loggedIn: 1, user, token: `jwt ` + token });
});
app.get(routes.loginfailure, (req, res) => {
  res.status(404).json({ loggedIn: 0 });
});
app.post(routes.signup, postSignUp);
app.post(routes.logout, postLogout);

app.get(`${routes.profile}/:id`, getProfile);
app.post(routes.profile, postProfile, (req, res) => {
  const { user } = req;
  res.status(200).json({ user });
});
app.post(routes.edit, uploadAvatarMiddleware, postEdit);

app.post(routes.shelve, postShelve);
app.delete(routes.shelve, deleteShelve);

app.post(routes.upload, uploadCoverMiddleware, postBook);
app.post(`${routes.review}/like`, postLike);

app.get(`${routes.rank}/reader/:type`, getTopReaders);
app.get(`${routes.rank}/reviewer/:type`, getTopReviewers);
export default app;
