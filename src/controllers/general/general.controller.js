const { StatusCodes } = require("http-status-codes");
const { StatusNames, PositionNames, ColorNames, TargetNames, SizeNames, CategoriesNames, BrendNames } = require("../../utils/constants");

class GeneralController {
  static GetStatusNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(StatusNames) });
  };

  static PositionNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(PositionNames) });
  };

  static SizeNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(SizeNames) });
  };

  static ColorNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(ColorNames) });
  };

  static TargetNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(TargetNames) });
  };

  static CategoriesNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(CategoriesNames) });
  }

  static BrendNames = async (req, res) => {
    res
      .status(StatusCodes.OK)
      .json({ success: true, data: Object.values(BrendNames) });
  } 
}

module.exports = GeneralController;