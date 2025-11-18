const { Schema, model } = require("mongoose");
const {
  CollectionNames,
  RoleNames,
  StatusNames,
  PositionNames,
} = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    reg_key: { type: String },
    avatar: { type: String },
    session_token: { type: String, select: false },
    email_verified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: [RoleNames.USER, RoleNames.ADMIN, RoleNames.SUPERADMIN],
      default: RoleNames.USER,
    },

    status: {
      type: String,
      enun: [StatusNames.ACTIVE, StatusNames.BLOCKED],
      default: StatusNames.ACTIVE,
    },
    positions: [{ type: String, enum: Object.values(PositionNames) }],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const UserModel = model(
  CollectionNames.USER,
  dacumentSchema,
  CollectionNames.USER
);

module.exports = UserModel;
