import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();
const s3 = new aws.S3({
  secretAccessKey: process.env.AWS_SECRET,
  accessKeyId: process.env.AWS_KEY,
  region: "ap-northeast-2"
}); //s3 initialize
const uploadAvatar = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "happreads/avatars"
  })
});
const uploadCover = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket: "happreads/covers"
  })
});
//multer({ dest: "upload/avatars/" });
export const uploadAvatarMiddleware = uploadAvatar.single("avatar");
export const uploadCoverMiddleware = uploadCover.single("thumbnail");
