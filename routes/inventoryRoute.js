const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const Util = require("../utilities/");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
);

// 특정 차량 상세 정보 페이지 라우트
router.get("/detail/:id", Util.handleErrors(invController.getItemDetail));

// Route to build inventory management view
// router.get("/inv", invController.buildInventoryManagement);
router.get("/", invController.buildInventoryManagement);

router.get("/add-classification", invController.addClassificationView);
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.addInventoryView);
router.post("/add-inventory", invController.addInventory);

module.exports = router;
