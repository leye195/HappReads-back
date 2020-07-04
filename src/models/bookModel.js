import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: "title required",
  },
  contents: {
    type: String,
  },
  thumbnail: {
    type: String,
    default:
      "https://happreads.s3.ap-northeast-2.amazonaws.com/covers/placeholder-book-cover-default.png",
  },
  authors: [],
  genres: {
    type: String,
  },
  isbn: {
    type: String,
  },
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  votes: [
    {
      vote: {
        type: String,
        default: "0",
      },
      createdAt: {
        type: Date,
        default: Date.now(),
      },
      voter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ], //[{vote point, user._id}
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
const bookModel = mongoose.model("Book", bookSchema);
export default bookModel;
