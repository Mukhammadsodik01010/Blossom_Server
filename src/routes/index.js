const { Router } = require("express")
const Files_Router = require("./files/files.router");
const User_Router = require("./user/user.router");

const router = Router()

router.use("/files", Files_Router);
router.use("/users", User_Router);

module.exports = router