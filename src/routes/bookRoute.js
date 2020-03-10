import express from "express";
import routes from "../routes";
import {
  getReview,
  postReview,
  getBook,
  postRate,
  getBooks,
  deleteReview,
  editReview
} from "../controllers/bookController";
const app = express.Router();
app.post(`${routes.review}/:rid`, editReview);
app.get("/:id", getBook);
app.post("/:id", postRate);
app.get(`/:id${routes.review}`, getReview);
app.post(`/:id${routes.review}/:rid`, deleteReview);
app.post(`/:id${routes.review}`, postReview);
export default app;
