const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const Util = require("../utilities");

// 로그인 페이지 요청 처리
router.get("/", Util.handleErrors(accountController.buildLogin));
// router.get("/login", Util.handleErrors(accountController.buildLogin));

module.exports = router;
