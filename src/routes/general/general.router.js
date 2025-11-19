const { Router } = require("express");
const GeneralController = require("../../controllers/general/general.controller");

const General_Router = Router();

General_Router.get("/status-names", GeneralController.GetStatusNames);
General_Router.get("/position-names", GeneralController.PositionNames);
General_Router.get("/size-names", GeneralController.SizeNames);
General_Router.get("/color-names", GeneralController.ColorNames);
General_Router.get("/target-names", GeneralController.TargetNames);
General_Router.get("/categories-names", GeneralController.CategoriesNames);
General_Router.get("/brend-names", GeneralController.BrendNames);

module.exports = General_Router;
