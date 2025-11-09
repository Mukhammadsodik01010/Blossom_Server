const { Schema, model } = require("mongoose");
const { CollectionNames } = require("../../utils/constants");

const dacumentSchema = new Schema(
  {
    verification_code: {
      type: String,
      required: true,
    },
    verification_id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    is_verified: { type: Boolean, default: false },
    expires_at: {
      type: Date,
      default: Date.now,
      expires: "3m",
    },
  },
  {
    versionKey: false,
  }
);

const Reset_password_schema = model(
  CollectionNames.RESET_PASSWORD,
  dacumentSchema,
  CollectionNames.RESET_PASSWORD
);

module.exports = Reset_password_schema;
