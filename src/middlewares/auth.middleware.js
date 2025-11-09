const { StatusCodes } = require("http-status-codes");
const HttpException = require("../utils/http.exception");
const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/secrets");
const UserModel = require("../models/user/user.model");

const AuthMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new HttpException(StatusCodes.FORBIDDEN, "Token is not provided");
  }
  const decode = verify(token, JWT_SECRET);

  const user = await UserModel.findById(decode.user_id).select(
    "+session_token"
  );
  if (!user) {
    throw new HttpException(StatusCodes, NOT_FOUND, "User is not found");
  }
  if (token !== user.session_token) {
    throw new HttpException(StatusCodes.FORBIDDEN, "Another device loggen in");
  }

  req.user = {
    user_id: decode.user_id,
    role: user.role,
    positions: user?.positions || null,
  };
  next();
};
module.exports = AuthMiddleware;
