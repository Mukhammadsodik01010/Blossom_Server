const { StatusCodes } = require("http-status-codes");
const UserModel = require("../../models/user/user.model");
const HttpException = require("../../utils/http.exception");
const { genSalt, hash, compare } = require("bcryptjs");
const {
  RoleNames,
  PositionNames,
  EmailStatus,
} = require("../../utils/constants");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, REG_KEY } = require("../../utils/secrets");
const { sendMail } = require("../../utils/nodemailer");
const Reset_password_schema = require("../../models/reset_password/reset.password.model");

class UserController {
  static SignUpSuperAdmin = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const SuperAdmin = await UserModel.findOne({ role: RoleNames.SUPERADMIN });
    if (SuperAdmin) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "Super Admin alredy exists"
      );
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "User Already exists with this email"
      );
    }

    const Salt = await genSalt(10);
    const hashedPassword = await hash(password, Salt);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: RoleNames.SUPERADMIN,
      email_verified: true,
      positions: Object.values(PositionNames),
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Super Admin Created Successfully" });
  };

  static SignUpAdmin = async (req, res) => {
    const { firstName, lastName, email, password, reg_key } = req.body;

    if (reg_key !== REG_KEY) {
      throw new HttpException(StatusCodes.CONFLICT, "Wrong registration key");
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "User Already exists with this email"
      );
    }

    const Salt = await genSalt(10);
    const hashedPassword = await hash(password, Salt);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: RoleNames.ADMIN,
      positions: [PositionNames.UPLOAD_File, PositionNames.GET_DASHBOARD_DATA],
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Admin created Successfully" });
  };

  static SignUp = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new HttpException(
        StatusCodes.CONFLICT,
        "User Already exists with this email"
      );
    }

    const Salt = await genSalt(10);
    const hashedPassword = await hash(password, Salt);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: RoleNames.USER,
      positions: [PositionNames.UPLOAD_File],
    });

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User Created Successfully" });
  };

  static SignIn = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await UserModel.findOne({
      email,
    });
    if (!existingUser) {
      throw new HttpException(StatusCodes.CONFLICT, "Wrong email or password");
    }

    const isMatch = await compare(password, existingUser.password);
    if (!isMatch) {
      throw new HttpException(StatusCodes.CONFLICT, "Wrong email or password");
    }

    const token = jwt.sign({ user_id: existingUser._id }, JWT_SECRET, {
      expiresIn: "24h",
    });

    existingUser.session_token = token;
    await existingUser.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Login successful", token });
  };

  static GetMe = async (req, res) => {
    const user = await UserModel.findById(req.user.user_id).select(
      "-password -session_token"
    );

    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }
    return res.status(StatusCodes.OK).json({ success: true, data: user });
  };

  static EditMe = async (req, res) => {
    const { avatar, firstName, lastName, email } = req.body;
    const user = await UserModel.findById(req.user.user_id);
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }

    if (avatar && avatar !== undefined && avatar !== "") user.avatar = avatar;
    if (firstName && firstName !== undefined && firstName !== "")
      user.firstName = firstName;
    if (lastName && lastName !== undefined && lastName !== "")
      user.lastName = lastName;
    if (email && email !== undefined && email !== "") {
      if (!user.email_verified) {
        throw new HttpException(
          StatusCodes.CONFLICT,
          "Please verify your email first"
        );
      }

      const availableuser = await UserModel.findOne({ email });
      if (availableuser) {
        throw new HttpException(StatusCodes.CONFLICT, "Email already exists");
      }

      user.email = email;
    }

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Changes saved successfully" });
  };

  static ForgetPassword = async (req, res) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Email is not registered yet"
      );
    }

    const verification_code = Math.floor(1000 + Math.random() * 9000);
    const verification_id = Math.floor(10000 + Math.random() * 90000);

    const Salt = await genSalt(10);
    const hashedVerificationCode = await hash(
      verification_code.toString(),
      Salt
    );

    await sendMail(
      email,
      "Password Reset",
      `Your verification code is <${verification_code}>`
    );

    await Reset_password_schema.create({
      verification_code: hashedVerificationCode,
      verification_id,
      email,
    });

    const EmailToken = jwt.sign(
      { id: verification_id, email: email },
      JWT_SECRET,
      {
        expiresIn: "3m",
      }
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Verification code sent to email",
      EmailToken,
    });
  };

  static VerifyCode = async (req, res) => {
    const { verification_code } = req.body;
    const { verification_id, email } = req.email_verify;

    const user = await Reset_password_schema.findOne({ verification_id });
    if (!user) {
      throw new HttpException(
        StatusCodes.BAD_GATEWAY,
        "Invalid verification id"
      );
    }

    if (user.is_verified) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Verification code alredy used"
      );
    }

    const isMatch = await compare(
      verification_code.toString(),
      user.verification_code
    );
    if (!isMatch) {
      throw new HttpException(StatusCodes.CONFLICT, "Wrong verification code");
    }

    user.is_verified = true;
    await user.save();

    const userOne = await UserModel.findOne({ email });
    if (!userOne) {
      throw new HttpException(StatusCodes.CONFLICT, "User not Found");
    }

    userOne.email_verified = true;
    await userOne.save();

    const ResetToken = jwt.sign({ email: email }, JWT_SECRET, {
      expiresIn: "3m",
    });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Verification successfull", ResetToken });
  };

  static ResetPassword = async (req, res) => {
    const { password } = req.body;
    const { email } = req.reset_password;

    const record = await Reset_password_schema.findOne({ email });
    if (!record || !record.is_verified) {
      throw new HttpException(
        StatusCodes.BAD_REQUEST,
        "Email not verified for password reset"
      );
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }

    const SaltNumber = await genSalt(10);
    const hashedPassword = await hash(password, SaltNumber);

    user.password = hashedPassword;
    await user.save();

    await Reset_password_schema.deleteMany({ email });

    res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Password reset successfully" });
  };

  static GetUserById = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id).select(
      "-password -session_token"
    );
    if (!user) {
      throw new HttpException(StatusCodes.CONFLICT, "User not available");
    }

    return res.status(StatusCodes.OK).json({ success: true, data: user });
  };

  static GetAllUsers = async (req, res) => {
    let { search = "", page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query =
      search.trim() !== ""
        ? {
            role: RoleNames.USER,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : { role: RoleNames.USER };

    const users = await UserModel.find(query)
      .select("-password -session_token")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await UserModel.countDocuments(query);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: users,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit),
        total,
        hasNextPage: Number(page) * limit < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  };

  static GetAllAdmins = async (req, res) => {
    let { search = "", page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query =
      search.trim() !== ""
        ? {
            role: RoleNames.ADMIN,
            _id: { $ne: req.user.user_id },
            $or: [
              { firstName: { $regex: search, $options: "i" } },
              { lastName: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : { role: RoleNames.ADMIN, _id: { $ne: req.user.user_id } };

    const admins = await UserModel.find(query)
      .select("-password -session_token")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await UserModel.countDocuments(query);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: admins,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(total / limit),
        limit: Number(limit),
        total,
        hasNextPage: Number(page) * limit < total,
        hasPrevPage: Number(page) > 1,
      },
    });
  };

  static EditUsersByID = async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    const user = await UserModel.findById({
      _id: id,
      role: { $ne: RoleNames.SUPERADMIN },
    }).select("-password -session_token");
    if (!user) {
      throw new HttpException(StatusCodes.CONFLICT, "User not found");
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) {
      user.email = email;
      user.email_verified = false;
    }

    await user.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User edited successfully" });
  };

  static DeleteUserByID = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findByIdAndDelete(id);
    if (!user) {
      throw new HttpException(StatusCodes.CONFLICT, "User not found");
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "User deleted successfully" });
  };
}

module.exports = { UserController };
