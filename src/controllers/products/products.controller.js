const { StatusCodes } = require("http-status-codes");
const ProductsModel = require("../../models/products/products.model");
const HttpException = require("../../utils/http.exception");
const { StatusNames } = require("../../utils/constants");
const UserModel = require("../../models/user/user.model");

class ProductsController {
  static AddProduct = async (req, res) => {
    const {
      name,
      brend,
      category,
      image,
      cost,
      compound,
      color,
      size,
      target,
    } = req.body;

    const creater = req.user.user_id;

    const product = await ProductsModel.create({
      name,
      brend,
      category,
      image,
      cost,
      compound,
      color,
      size,
      target,
      creater,
    });

    const user = await UserModel.findOne({ _id: creater });
    if (!user) {
      throw new HttpException(StatusCodes.NOT_FOUND, "User not found");
    }
    user.products.push(product._id);
    await user.save();

    res
      .status(StatusCodes.CREATED)
      .json({ success: true, message: "Product created successfully" });
  };

  static GetAllProducts = async (req, res) => {
    let { search = "", page = 1, limit = 9 } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query =
      search.trim() !== ""
        ? {
            status: StatusNames.ACTIVE,
            $or: [
              { name: { $regex: search, $options: "i" } },
              { brend: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
            ],
          }
        : { status: StatusNames.ACTIVE };

    const products = await ProductsModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await ProductsModel.countDocuments(query);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: products,
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

  static GetFilteredProducts = async (req, res) => {
    let {
      page = "1",
      limit = "8",
      target = "",
      category = "",
      size = "",
      color = "",
      brend = "",
      price = "",
      status = "",
    } = req.query;

    page = Number(page);
    limit = Number(limit);

    const query = {};

    // Status filter logic
    if (status === "active") {
      query.status = StatusNames.ACTIVE;
    } else if (status === "blocked") {
      query.status = StatusNames.BLOCKED;
    }

    if (target) query.target = target;
    if (category) query.category = { $regex: category, $options: "i" };
    if (brend) query.brend = { $regex: brend, $options: "i" };
    if (size) query.size = { $in: [size] };
    if (color) query.color = { $in: [color] };
    if (price) {
      const clean = price.replace("$", "");
      const [min, max] = clean.split("-").map(Number);

      query.cost = {
        $gte: min,
        $lte: max,
      };
    }

    const products = await ProductsModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ProductsModel.countDocuments(query);

    return res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit,
        total,
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  };

  static GetProductById = async (req, res) => {
    const { id } = req.params;
    const product = await ProductsModel.findById(id).populate(
      "creater",
      "_id email firstName lastName"
    );

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");
    }

    return res.status(StatusCodes.OK).json({ success: true, data: product });
  };

  static DeleteProductById = async (req, res) => {
    const { id } = req.params;

    const product = await ProductsModel.findByIdAndDelete(id);

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");
    }

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Product deleted successfully" });
  };

  static EditProductById = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      brend,
      category,
      image,
      cost,
      compound,
      color,
      size,
      target,
    } = req.body;

    const product = await ProductsModel.findOne({ _id: id });
    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product not found");
    }

    if (name && name !== undefined && name !== "" ) product.name = name;
    if (brend && brend !== undefined && brend !== "" ) product.brend = brend;
    if (category && category !== undefined && category !== "")
      product.category = category;
    if (image && image !== undefined && image !== "") product.image = image;
    if (cost && cost !== undefined && cost !== "") product.cost = cost;
    if (compound && compound !== undefined && compound !== "")
      product.compound = compound;
    if (color && color !== undefined && color.length > 0) product.color = color;
    if (size && size !== undefined && size.length > 0) product.size = size;
    if (target && target !== undefined && target !== "")
      product.target = target;

    await product.save();

    return res
      .status(StatusCodes.OK)
      .json({ success: true, message: "Product edited successfully" });
  };

  static EditProductStatus = async (req, res) => {
    const { id } = req.params;

    const product = await ProductsModel.findOne({ _id: id });

    if (!product) {
      throw new HttpException(StatusCodes.NOT_FOUND, "Product is not found");
    }

    product.status =
      product.status === StatusNames.ACTIVE
        ? StatusNames.BLOCKED
        : StatusNames.ACTIVE;
    await product.save();

    return res.status(200).json({
      success: true,
      message: "Product status updated",
    });
  };
}

module.exports = ProductsController;
