const { StatusCodes } = require("http-status-codes");
const HttpException = require("../utils/http.exception");
const { verify } = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/secrets");

const PasswordReset = async (req, res, next) => {
  try {
    const ResetToken = req.headers.authorization?.split(" ")[1];
    if (!ResetToken) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Token is not provided");
    }

    const decoded = verify(ResetToken, JWT_SECRET);

    req.reset_password = {
      email: decoded.email,
    };

    next();
  } catch (err) {
    throw new HttpException(
      StatusCodes.UNAUTHORIZED,
      "Invalid or expired token"
    );
  }
};

module.exports = PasswordReset;
