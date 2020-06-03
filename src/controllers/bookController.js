import reviewModel from "../models/reviewModel";
import bookModel from "../models/bookModel";
import userModel from "../models/userModel";
/**
 * GET /books
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

/*
 *GET /books/search?q={}&type={}
 * @param {*} req
 * @param {*} res
 */

export const getBookSearch = async (req, res) => {
  try {
    const {
      query: { q, type },
    } = req;
    console.log(q, parseInt(type) === 0);
    let books = [];
    if (parseInt(type) === 0) {
      books = await bookModel
        .find()
        .or([{ title: { $regex: q } }, { authors: { $regex: q } }]);
    } else if (parseInt(type) === 1) {
      books = await bookModel.find({ title: { $regex: q } });
    } else if (parseInt(type) === 2) {
      books = await bookModel.find({ authors: { $regex: q } });
    }
    res.json({ books, error: 0 });
  } catch (e) {
    res.json({ books: [], error: 1 });
  }
};

/**
 * GET /book/:id
 * @param {*} req
 * @param {*} res
 */
export const getBook = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const book = await bookModel.findById(id).populate({
      path: "review",
      populate: {
        path: "reviewer",
        model: userModel,
      },
    });
    console.log(book);
    if (book)
      res
        .status(200)
        .json({ error: 0, book /*,reviews: book.review, votes: book.votes*/ });
    else res.status(200).json({ error: 0 });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};

/**
 * POST /upload
 */
export const postBook = async (req, res) => {
  const {
    body: { title, authors, isbn, contents, uid, genres },
    file,
  } = req;
  //console.log(file);
  try {
    const book = new bookModel();
    const user = await userModel.findById(uid);
    book.title = title;
    book.authors.push(authors);
    book.isbn = isbn;
    book.contents = contents;
    book.thumbnail = file.location; //book.thunbnail=thumbnail;
    book.genres = genres;
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
    body: { vote, name },
    params: { id },
  } = req;
  console.log(id, vote, name);
  try {
    const user = await userModel.findByUsername(name);
    const book = await bookModel.findById(id);
    if (book !== null) {
      if (book.votes.length > 0) {
        let idx = -1;
        for (let i = 0; i < book.votes.length; i++) {
          if (String(book.votes[i]._id) === String(user._id)) {
            idx = i;
            break;
          }
        }
        if (idx !== -1) book.votes.splice(idx, 1);
        //유저가 예전에 이미 평점을 부여했을 경우 전에 부여했던 기록을 지우고 새로운 평가 점수를 추가
      }
      book.votes.push({ vote: vote, _id: user._id }); //{vote point, user._id}
      book.save();
      user.votes.push(book.id);
      user.save();
      res.status(200).json({ error: 0, book });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};

/**
 * GET /books/:id/review
 * @param {*} req
 * @param {*} res
 */

export const getReview = async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const reviews = await reviewModel
      .find({ book: id })
      .populate("reviewer")
      .populate("book");
    res.status(200).json({ error: 0, reviews });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};

/**
 * POST /books/:id/review
 * @param {*} req
 * @param {*} res
 */
export const postReview = async (req, res) => {
  const {
    body: { name, content, book: info },
  } = req;
  try {
    const user = await userModel.findByUsername(name);
    let book = await bookModel
      .findById(info._id)
      .populate({ path: "review", populate: { path: "reviewer" } });
    let newReview = new reviewModel({
      content,
      isbn: book.isbn,
      book: book.id,
      reviewer: user.id,
    });
    newReview.save();
    user.reviews.push(newReview.id);
    user.save();
    book.review.push(newReview.id);
    book.save();
    newReview = await newReview.populate("reviewer").execPopulate();
    //console.log(newReview);
    res.status(200).json({
      error: 0,
      reviews: [...book.review.splice(0, book.review.length - 1), newReview],
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
/**
 * DELETE books/:id/review/:rid
 * @param {*} req
 * @param {*} res
 */
export const deleteReview = async (req, res) => {
  const {
    params: { isbn, rid },
    body: { uid, from },
  } = req;
  try {
    console.log(uid, bid, rid);
    const review = await reviewModel.findByIdAndDelete(rid);
    const book = await bookModel.findOne({ isbn: isbn }).populate("review");
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
    const cleanedBookReviews = book.review.filter((review) => {
      return String(review.id) !== String(rid);
    });
    const cleanedReviews = user.reviews.filter((review) => {
      return String(review.id) !== String(rid);
    });
    book.review = cleanedBookReviews;
    user.reviews = cleanedReviews;
    book.save();
    user.save();
    if (from === "profile") {
      res.status(200).json({ error: 0, profile: user });
    } else if (from === "book") {
      res.status(200).json({ error: 0, reviews: book.review });
    } else {
      throw error("from should be profile or book");
    }
  } catch (error) {
    console.log(error);
  }
};
export const editReview = async (req, res) => {
  const {
    params: { rid },
    body: { content },
  } = req;
  try {
    const review = await reviewModel.findByIdAndUpdate(rid, {
      content: content,
    });
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
