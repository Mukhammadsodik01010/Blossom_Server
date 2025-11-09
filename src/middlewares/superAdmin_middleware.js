const UserModel = require("../models/user/user.model");

const SuperAdminMiddleware = async (req, res, next) => {
  const { user_id } = req.user;

  const user = await UserModel.findById(user_id);
  if (!user || user.role !== RoleNames.SUPERADMIN) {
    throw new HttpException(
      StatusCodes.FORBIDDEN,
      "Access denied. Superadmin only."
    );
  }

  next();
};
module.exports = SuperAdminMiddleware;
