import express from "express";
import routes from "../routes";
import {
  getReview,
  postReview,
  getBook,
  postRate,
  deleteReview,
  editReview,
  getRecentBooks,
  getSliderBooks,
  getBookSearch,
} from "../controllers/bookController";
const app = express.Router();
app.get(`/search`, getBookSearch);
app.get(`/sliders`, getSliderBooks);
app.post(`${routes.review}/:rid`, editReview);
app.get("/:id", getBook);
app.post("/:id", postRate);
app.get(`/:id${routes.review}`, getReview);
app.delete(`/:id${routes.review}/:rid`, deleteReview);
app.post(`/:id${routes.review}`, postReview);

export default app;
