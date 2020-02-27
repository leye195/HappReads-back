import express from "express";
import routes from "../routes";
import {
  getReview,
  postReview,
  getBook,
  postRate,
  getBooks
} from "../controllers/bookController";
const app = express.Router();
app.get("/:id", getBook);
app.post("/:id", postRate);
app.get("/:id" + routes.review, getReview);
app.post("/:id" + routes.review, postReview);
export default app;
