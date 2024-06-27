"use strict"
exports.__esModule = true
exports.setUserPlugin = exports.setUserModel = exports.userSchema = exports.User = void 0
var mongoose_1 = require("mongoose")
exports.User = null
exports.userSchema = new mongoose_1["default"].Schema()
function setUserModel() {
  if (!exports.User) {
    exports.User = mongoose_1["default"].model("User", exports.userSchema, "users")
  }
}
exports.setUserModel = setUserModel
function setUserPlugin(plugin) {
  exports.userSchema.plugin(plugin)
}
exports.setUserPlugin = setUserPlugin
