const { Schema, model } = require("mongoose");
const {
  CollectionNames,
  StatusNames,
  SizeNames,
  ColorNames,
  TargetNames,
  BrendNames,
  CategoriesNames,
} = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    name: { type: String, required: true },
    brend: { type: String, required: true, enum: Object.values(BrendNames) },
    category: {
      type: String,
      required: true,
      enum: Object.values(CategoriesNames),
    },
    image: { type: String, required: true },
    cost: { type: String, required: true },
    compound: { type: String, required: true },
    color: [{ type: String, required: true, enum: Object.values(ColorNames) }],
    size: [{ type: String, required: true, enum: Object.values(SizeNames) }],
    target: {
      type: String,
      required: true,
      enum: Object.values(TargetNames),
    },
    sale: { type: String },
    status: {
      type: String,
      enun: [StatusNames.ACTIVE, StatusNames.BLOCKED],
      default: StatusNames.ACTIVE,
    },
    creater: {
      type: Schema.ObjectId,
      ref: CollectionNames.USER,
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const ProductsModel = model(
  CollectionNames.PRODUCTS,
  dacumentSchema,
  CollectionNames.PRODUCTS
);

module.exports = ProductsModel;
