"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadCoverMiddleware = exports.uploadAvatarMiddleware = void 0;

var _multer = _interopRequireDefault(require("multer"));

var _multerS = _interopRequireDefault(require("multer-s3"));

var _awsSdk = _interopRequireDefault(require("aws-sdk"));

var _dotenv = _interopRequireDefault(require("dotenv"));

_dotenv["default"].config();

var s3 = new _awsSdk["default"].S3({
  secretAccessKey: process.env.AWS_SECRET,
  accessKeyId: process.env.AWS_KEY,
  region: "ap-northeast-2"
}); //s3 initialize

var uploadAvatar = (0, _multer["default"])({
  storage: (0, _multerS["default"])({
    s3: s3,
    acl: "public-read",
    bucket: "happreads/avatars"
  })
});
var uploadCover = (0, _multer["default"])({
  storage: (0, _multerS["default"])({
    s3: s3,
    acl: "public-read",
    bucket: "happreads/covers"
  })
}); //multer({ dest: "upload/avatars/" });

var uploadAvatarMiddleware = uploadAvatar.single("avatar");
exports.uploadAvatarMiddleware = uploadAvatarMiddleware;
var uploadCoverMiddleware = uploadCover.single("thumbnail");
exports.uploadCoverMiddleware = uploadCoverMiddleware;