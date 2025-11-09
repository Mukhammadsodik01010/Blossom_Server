const { StatusCodes } = require("http-status-codes");
const HttpException = require("../utils/http.exception");
const { JWT_SECRET } = require("../utils/secrets");
const { verify } = require("jsonwebtoken");

const EmailMiddleware = async (req, res, next) => {
  try {
    const EmailToken = req.headers.authorization?.split(" ")[1];
    if (!EmailToken) {
      throw new HttpException(StatusCodes.FORBIDDEN, "Token is not provided");
    }

    const decoded = verify(EmailToken, JWT_SECRET);

    req.email_verify = {
      verification_id: decoded.id,
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

module.exports = EmailMiddleware;
