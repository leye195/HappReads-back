import passport from "passport";
import passportJWT from "passport-jwt";
import User from "./models/userModel";
import dotenv from "dotenv";
dotenv.config();

const jwtStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

passport.use(User.createStrategy()); //passport.use(new LocalStrategy(User.authenticate()));
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: extractJWT.fromAuthHeaderWithScheme("jwt"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (jwtPayload, done) => {
      if (jwtPayload.user) {
        //console.log(jwtPayload.user._id);
        const user = await User.findById(jwtPayload.user._id)
          .populate("reading")
          .populate("read")
          .populate("want_read")
          .populate({
            path: "reviews",
            populate: { path: "book" }
          })
          .populate("uploaded");
        return done(null, user);
      } else return done(null, false);
    }
  )
);
//use static serialize and deserializ of model for passport session support
passport.serializeUser(User.serializeUser()); //쿠키에 user.id를 저장
passport.deserializeUser(User.deserializeUser()); //id를 식별자로 db 데이터와 비교
