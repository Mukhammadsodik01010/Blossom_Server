const { Router } = require("express");
const { UserController } = require("../../controllers/user/user.controller");
const { UserValidator } = require("../../validators/user/user.validator");
const expressValidator = require("../../validators");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RoleMiddleware = require("../../middlewares/role.middleware");
const { PositionNames } = require("../../utils/constants");
const EmailMiddleware = require("../../middlewares/email_middleware");
const PasswordReset = require("../../middlewares/reset_middleware");

const User_Router = Router();

User_Router.post(
  "/add-superadmin",
  UserValidator.SignUp(),
  expressValidator,
  UserController.SignUpSuperAdmin
);

User_Router.post(
  "/sign-up",
  UserValidator.SignUp(),
  expressValidator,
  UserController.SignUp
);

User_Router.post(
  "/sign-up-admin",
  UserValidator.SignUpAdmin(),
  expressValidator,
  UserController.SignUpAdmin
);

User_Router.post(
  "/sign-in",
  UserValidator.SignIn(),
  expressValidator,
  UserController.SignIn
);

User_Router.post(
  "/forget-password",
  UserValidator.ForgetPassword(),
  expressValidator,
  UserController.ForgetPassword
);
User_Router.post(
  "/verify-code",
  EmailMiddleware,
  UserValidator.VerifyCode(),
  expressValidator,
  UserController.VerifyCode
);
User_Router.post(
  "/reset-password",
  PasswordReset,
  UserValidator.ResetPassword(),
  expressValidator,
  UserController.ResetPassword
);

User_Router.get("/get-me", AuthMiddleware, UserController.GetMe);
User_Router.post("/edit-me", AuthMiddleware, UserController.EditMe);

User_Router.get(
  "/user-by-id/:id",
  UserValidator.GetUserById(),
  expressValidator,
  UserController.GetUserById
);

User_Router.get(
  "/get-all-users",
  AuthMiddleware,
  RoleMiddleware(PositionNames.GET_DASHBOARD_DATA),
  UserController.GetAllUsers
);

User_Router.get(
  "/get-all-admins",
  AuthMiddleware,
  RoleMiddleware(PositionNames.GET_DASHBOARD_DATA),
  UserController.GetAllAdmins
);

User_Router.post(
  "/edit-user-by-id/:id",
  AuthMiddleware,
  RoleMiddleware(PositionNames.EDIT_USER_DATA),
  UserController.EditUsersByID
);

User_Router.delete(
  "/delete-user-by-id/:id",
  AuthMiddleware,
  RoleMiddleware(PositionNames.DELETE_USER_DATA),
  UserController.DeleteUserByID
);

module.exports = User_Router;
