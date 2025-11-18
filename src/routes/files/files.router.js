const { Router } = require("express");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const { uploadFile } = require("../../utils/file.upload");
const UploadController = require("../../controllers/files/files.controller");
const RoleMiddleware = require("../../middlewares/role.middleware");
const { PositionNames } = require("../../utils/constants");

const Files_Router = Router();

Files_Router.post(
  "/",
  AuthMiddleware,
  RoleMiddleware(PositionNames.UPLOAD_File),
  uploadFile.single("file"),
  UploadController.UplloadFile
);

module.exports = Files_Router;
