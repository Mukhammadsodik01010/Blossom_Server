class CollectionNames {
  static USER = "user";
  static SAVE_FILE = "save_file";
  static RESET_PASSWORD = "reser_password";
}

class RoleNames {
  static SUPERADMIN = "superadmin"
  static ADMIN = "admin";
  static USER = "user";
}

class StatusNames {
  static ACTIVE = "active"
  static BLOCKED = "blocked"
}

class EmailStatus {
  static VERIFIED = "verified"
  static UNVERIFIED = "unverified"
}
 
class PositionNames {
  static GET_DASHBOARD_DATA = "getDashboardData"
  static EDIT_USER_DATA = "editUserData"
  static DELETE_USER_DATA = "deleteUserData"
  static UPLOAD_File = "uploadFile";
  static ADD_PRODUCT = "addProduct";
  static EDIT_PRODUCT = "editProduct";
  static DELETE_PRODUCT = "deleteProduct";
}

module.exports = {
  CollectionNames,
  RoleNames,
  StatusNames,
  EmailStatus,
  PositionNames,
};
