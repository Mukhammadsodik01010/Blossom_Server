const { Router } = require("express");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RoleMiddleware = require("../../middlewares/role.middleware");
const { PositionNames } = require("../../utils/constants");
const ProductsController = require("../../controllers/products/products.controller");

const Products_Router = Router();

Products_Router.post(
  "/add-product",
  AuthMiddleware,
  RoleMiddleware(PositionNames.ADD_PRODUCT),
  ProductsController.AddProduct
);

Products_Router.get("/get-all-products", ProductsController.GetAllProducts);

Products_Router.get(
  "/get-filtered-products",
  ProductsController.GetFilteredProducts
);

Products_Router.get(
  "/get-product-by-id/:id",
  ProductsController.GetProductById
);

Products_Router.delete(
  "/delete-product/:product_id",
  AuthMiddleware,
  RoleMiddleware(PositionNames.DELETE_PRODUCT),
  ProductsController.DeleteProductById
);

module.exports = Products_Router;
