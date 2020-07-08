import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.connect(
  process.env.PRODUCTION
    ? process.env.MONGO_URL_PRO
    : process.env.MONGO_URL_DEV,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  }
);
const db = mongoose.connection;
const handleOpen = () => {
  console.log("Connect to MongoDB");
};
const handleError = (error) => {
  console.log(`Error on DB Connection: ${error}`);
};
db.once("open", handleOpen);
db.on("error", handleError);
