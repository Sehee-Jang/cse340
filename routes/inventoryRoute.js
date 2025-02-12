// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// 특정 차량 상세 정보 페이지 라우트
router.get("/detail/:id", invController.getItemDetail);

module.exports = router;
