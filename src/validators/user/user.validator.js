const { body, query, param } = require("express-validator");

class UserValidator {
  static SignUp = () => [
    body("firstName", "firstName is required and must be string")
      .notEmpty()
      .isString(),
    body("lastName", "lastName is required and must be string")
      .notEmpty()
      .isString(),
    body("email", "Email is required and must be valid email")
      .notEmpty()
      .isEmail(),
    body("password", "Password is required and must be string")
      .notEmpty()
      .isString(),
    body(
      "password",
      "Password must be at least 8 characters and contain at least one uppercase, one lovercase and one number. But no special characters"
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ];

  static SignUpAdmin = () => [
    body("reg_key", "Registration key is required and must be string")
      .notEmpty()
      .isString(),
    body("firstName", "firstName is required and must be string")
      .notEmpty()
      .isString(),
    body("lastName", "lastName is required and must be string")
      .notEmpty()
      .isString(),
    body("email", "Email is required and must be valid email")
      .notEmpty()
      .isEmail(),
    body("password", "Password is required and must be string")
      .notEmpty()
      .isString(),
    body(
      "password",
      "Password must be at least 8 characters and contain at least one uppercase, one lovercase and one number. But no special characters"
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ];

  static SignIn = () => [
    body("email", "Email is required and must be valid email")
      .notEmpty()
      .isEmail(),
    body("password", "Password is required and must be string")
      .notEmpty()
      .isString(),
  ];

  static ForgetPassword = () => [
    body("email", "Email is required and must be valid email")
      .notEmpty()
      .isEmail(),
  ];

  static VerifyCode = () => [
    body(
      "verification_code",
      "verification code is required and must be string"
    )
      .notEmpty()
      .isString(),
  ];

  static ResetPassword = () => [
    body("password", "Password is required and must be string")
      .notEmpty()
      .isString(),
    body(
      "password",
      "Password must be at least 8 characters and contain at least one uppercase, one lovercase and one number. But no special characters"
    ).isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    }),
  ];

  static GetUserById = () => [
    param("id", "ID must be valid MongoDB obkect ID").isMongoId()
  ]
}

module.exports = { UserValidator };
