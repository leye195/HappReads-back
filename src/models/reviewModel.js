import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book"
  },
  isbn: {
    type: String
  },
  content: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  }
});
const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
