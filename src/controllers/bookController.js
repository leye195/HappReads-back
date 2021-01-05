import reviewModel from "../models/reviewModel";
import bookModel from "../models/bookModel";
import userModel from "../models/userModel";

export const getAllBooks = async (req, res, next) => {
  try {
    const books = await bookModel
      .find()
      .populate({
        path: "review",
        populate: {
          path: "reviewer",
          model: userModel,
        },
      })
      .populate({
        path: "votes.voter",
      });
    return res.status(200).json(books);
  } catch (e) {
    next(e);
  }
};

/**
 * GET /books/:type?page={page}
 * @param {*} req
 * @param {*} res
 */
export const getBooks = async (req, res) => {
  try {
    const {
      params: { type },
      query: { page = 1 },
    } = req;
    let books = [];
    if (type === "전체") {
      books = await bookModel
        .find()
        .sort({ _id: -1 })
        .skip((parseInt(page, 10) - 1) * 15)
        .limit(15);
    } else {
      books = await bookModel
        .find({ genres: { $regex: type } })
        .sort({ _id: -1 })
        .skip(((+page) - 1)* 15)
        .limit(15);
    }
    res.status(200).json({ error: 0, books, page: parseInt(page, 10) });
  } catch (error) {
    res.status(400).json({ error: 1 });
  }
};

/**
 * PUT /book/:id
 * @param {*} req
 * @param {*} res
 */
export const editBook = async (req, res, next) => {
  try {
    const {
      body: { title, contents, genres },
      params: { id },
    } = req;
    await bookModel.findByIdAndUpdate(id, {
      title,
      contents,
      genres,
    });
    res.status(200).end();
  } catch (e) {
    next(e);
  }
};

/*
 *GET /sliders
 * @param {*} req
 * @param {*} res
 */
export const getSliderBooks = async (req, res, next) => {
  try {
    const books = await bookModel.find(),
      sliderBooks = [];
    if (sliderBooks.lenght >= 8) {
      while (sliderBooks.length !== 8) {
        const book = books[(books.length * Math.random()) | 0];
        if (!sliderBooks.includes(book)) sliderBooks.push(book);
      }
      res.status(200).json({ books: sliderBooks });
    } else {
      res.status(200).json({ books });
    }
  } catch (e) {
    next(e);
  }
};

/** 
 * GET /popular
 * @param {*} req
 * @param {*} res
 **/
export const getPopularBooks = async (req, res, next) => {
  try {
    const books = await bookModel.find().populate({
      path: "votes.voter",
    });
    const newBooks = books
      .filter((book) => book.votes.length >= 1) //최소 한번은 평가 되어야 들어감
      .map((book) => {
        return {
          ...book._doc,
          avg_vote:
            book.votes && book.votes.length > 0
              ? (
                  book.votes.reduce((x, y) => x + parseFloat(y.vote), 0) /
                  book.votes.length
                ).toFixed(2)
              : 0,
        };
      })
      .sort((x, y) => y.avg_vote - x.avg_vote);
    res.status(200).json(newBooks);
  } catch (e) {
    next(e);
  }
};

/** 
 * GET /recent
 * @param {*} req
 * @param {*} res
 */
export const getRecentBooks = async (req, res, next) => {
  try {
    const books = await bookModel.find().sort({ createdAt: -1 });
    res.status(200).json(books);
  } catch (e) {
    next(e);
  }
};

/** 
 * GET /search?q={q}&type={type}&page={page}
 * @param {*} req
 * @param {*} res
 */
export const getBookSearch = async (req, res) => {
  try {
    const {
      query: { q, type, page = 1 },
    } = req;
    let books = [];
    if (parseInt(type) === 0) {
      books = await bookModel
        .find()
        .or([{ title: { $regex: q } }, { authors: { $regex: q } }])
        .skip((page-1)*10)
        .limit(10);
    } else if (parseInt(type) === 1) {
      books = await bookModel.find({ title: { $regex: q } })
      .skip((page-1)*10)
      .limit(10);;
    } else if (parseInt(type) === 2) {
      books = await bookModel.find({ authors: { $regex: q } })
      .skip((page-1)*10)
      .limit(10);;
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
    const book = await bookModel
      .findById(id)
      .populate({
        path: "review",
        populate: {
          path: "reviewer",
          model: userModel,
        },
      })
      .populate({
        path: "votes.voter",
      });
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
    body: { title, authors, contents, uid, genres },
    file,
  } = req;
  //console.log(file);
  try {
    const book = new bookModel();
    const user = await userModel.findById(uid);
    book.title = title;
    book.authors.push(authors);
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
  try {
    const user = await userModel.findByUsername(name);
    let book = await bookModel.findById(id).populate({
      path: "votes.voter",
    });
    if (book !== null) {
      if (book.votes.length > 0) {
        let idx = -1;
        for (let i = 0; i < book.votes.length; i++) {
          if (String(book.votes[i].voter._id) === String(user._id)) {
            idx = i;
            console.log(idx);
            break;
          }
        }
        if (idx !== -1) book.votes.splice(idx, 1);
        //유저가 예전에 이미 평점을 부여했을 경우 전에 부여했던 기록을 지우고 새로운 평가 점수를 추가
      }
      book.votes.push({ vote: vote, voter: user }); //{vote point, user._id}
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
 * GET /book/:id/review
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
export const deleteReview = async (req, res, next) => {
  const {
    params: { id, rid },
    body: { uid },
  } = req;
  try {
    console.log(uid, id, rid);
    if (id && uid && rid) {
      await reviewModel.findByIdAndDelete(rid);
      const book = await bookModel.findById(id).populate("review");
      const user = await userModel
        .findById(uid)
        .populate("reading.book")
        .populate("read.book")
        .populate("want_read.book")
        .populate({
          path: "reviews",
          populate: { path: "book" },
        })
        .populate("uploaded")
        .populate("likes");
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
      console.log(user);
      res.status(200).json({ error: 0, user });
    } else {
      res.status(403).end();
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const editReview = async (req, res) => {
  const {
    params: { rid },
    body: { content },
  } = req;
  try {
    await reviewModel.findByIdAndUpdate(rid, {
      content: content,
    });
    res.status(200).json({ error: 0 });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 1 });
  }
};
