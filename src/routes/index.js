const { Router } = require("express")
const Files_Router = require("./files/files.router");
const User_Router = require("./user/user.router");
const Products_Router = require("./products/products.router");
const General_Router = require("./general/general.router");

const router = Router()

router.use("/files", Files_Router);
router.use("/users", User_Router);
router.use("/products", Products_Router);
router.use("/general", General_Router);

module.exports = router