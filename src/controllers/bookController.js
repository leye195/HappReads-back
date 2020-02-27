import reviewModel from "../models/reviewModel";
import bookModel from "../models/bookModel";
import userModel from "../models/userModel";
/**
 * /books
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
  try {
    const books = await bookModel.find().sort({ _id: -1 });
    res.status(200).json({ error: 0, books });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};
/**
 * GET /book/:id
 * @param {*} req
 * @param {*} res
 */
export const getBook = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const book = await bookModel.findOne({ isbn: id }).populate({
      path: "review",
      populate: {
        path: "reviewer",
        model: userModel
      }
    });
    //console.log(book);
    if (book)
      res
        .status(200)
        .json({ error: 0, reviews: book.review, votes: book.votes });
    else res.status(200).json({ error: 0 });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};
export const postBook = async (req, res) => {
  const {
    body: { title, authors, isbn, contents, uid },
    file
  } = req;
  console.log(file);
  try {
    const book = new bookModel();
    const user = await userModel.findById(uid);
    book.title = title;
    book.authors.push(authors);
    book.isbn = isbn;
    book.contents = contents;
    book.thumbnail = file.location; //book.thunbnail=thumbnail;
    book.save();
    user.uploaded.push(book.id);
    user.save();
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};

/**
 * POST /book/:id
 * @param {*} req
 * @param {*} res
 */
export const postRate = async (req, res) => {
  const {
    body: { title, authors, vote, isbn, name, thumbnail }
  } = req;
  console.log(req.body);
  try {
    const user = await userModel.findByUsername(name);
    const book = await bookModel.findOne({ isbn: isbn });
    //console.log(book);
    if (book !== null) {
      book.title = title;
      book.authors = authors;
      book.isbn = isbn;
      book.thumbnail = thumbnail;
      book.votes.push(vote);
      book.save();
      user.votes.push(book.id);
      res.status(200).json({ error: 0, book });
    } else {
      const newBook = new bookModel();
      newBook.title = title;
      newBook.authors = authors;
      newBook.isbn = isbn;
      newBook.thumbnail = thumbnail;
      newBook.votes.push(vote);
      newBook.save();
      user.votes.push(newBook.id);
      res.status(200).json({ error: 0, book: newBook });
    }
    user.save();
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};

/**
 * GET /book/:id/review
 * @param {*} req
 * @param {*} res
 */

export const getReview = async (req, res) => {
  const {
    params: { id }
  } = req;
  try {
    const reviews = await reviewModel.find({ isbn: id }).populate("reviewer");
    //console.log(reviews);
    res.status(200).json({ error: 0, reviews });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};

/**
 * POST /book/:id/review
 * @param {*} req
 * @param {*} res
 */
export const postReview = async (req, res) => {
  const {
    body: { name, isbn, content, book: info }
  } = req;
  console.log(info);
  try {
    const user = await userModel.findByUsername(name);
    const book = await bookModel.findOne({ isbn: isbn }).populate("review");
    const newReview = new reviewModel();
    if (book) {
      newReview.content = content;
      newReview.isbn = isbn;
      newReview.book = book.id;
      newReview.reviewer = user.id;
      newReview.save();
      user.reviews.push(newReview.id);
      user.save();
      book.review.push(newReview.id);
      book.save();
      res.status(200).json({ error: 0, reviews: book.review });
    } else {
      const newBook = new bookModel();
      newReview.content = content;
      newReview.isbn = isbn;
      newReview.reviewer = user.id;

      newBook.isbn = isbn;
      newBook.title = info.title;
      newBook.authors = info.authors;
      newBook.thumbnail = info.thunbnail;
      newBook.review.push(newReview.id);
      newBook.save();
      newReview.book = newBook.id;
      res.status(200).json({ error: 0, reviews: newBook.review });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};

export const deleteReview = (req, res) => {};
