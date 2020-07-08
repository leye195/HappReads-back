import express from "express";
import "./db";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes";
import globalRoute from "./routes/globalRoute";
import bookRoute from "./routes/bookRoute";
import passport from "passport";
import dotenv from "dotenv";
import "./passport";
dotenv.config();
const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(passport.initialize());
app.use(routes.home, globalRoute);
app.use(routes.book, bookRoute);

app.listen(process.env.PORT || 8000, () => {
  console.log(`listening on port ${process.env.PORT || 8000}`);
});
