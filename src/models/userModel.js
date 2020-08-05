import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";
const userSchema = mongoose.Schema({
  nickname: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    unique: true,
  },
  avatarUrl: {
    type: String,
    default:
      "https://wetuberbucket.s3.ap-northeast-2.amazonaws.com/avatars/58c11a401956bab841de5f227c337c43",
  },
  githubId: Number,
  intro: {
    type: String,
    default: "",
  },
  interest: {
    type: String,
    default: "",
  },
  website: {
    type: String,
    default: "",
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  uploaded: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  votes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  want_read: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  reading: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  read: [
    {
      book: { type: mongoose.Schema.Types.ObjectId, ref: "Book" },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  token: {
    type: String,
    default: "",
  },
});
userSchema.plugin(passportLocalMongoose, { usernameField: "email" }); //plugin 추가
const userModel = mongoose.model("User", userSchema);
export default userModel;
