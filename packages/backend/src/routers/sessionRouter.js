"use strict"
exports.__esModule = true
exports.sessionRouter = void 0
var express_1 = require("express")
var controllers_1 = require("../controllers")
var router = (0, express_1.Router)()
router.post("/login", controllers_1.login)
router.post("/logout", controllers_1.logout)
exports.sessionRouter = router
