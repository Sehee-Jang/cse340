const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidation = require("../utilities/inventory-validation");
const Util = require("../utilities/");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  Util.handleErrors(invController.buildByClassificationId)
);

// 특정 차량 상세 정보 페이지 라우트
router.get("/detail/:id", Util.handleErrors(invController.getItemDetail));

// ✅ 이 아래부터는 관리자/직원만 접근 가능
router.use(Util.checkAdminOrEmployee); 

// Route to build inventory management view
router.get("/", invController.buildInventoryManagement);
router.get("/add-classification", invController.addClassificationView);
router.post("/add-classification", invController.addClassification);

router.get("/add-inventory", invController.addInventoryView);
router.post("/add-inventory", invController.addInventory);

// 특정 분류에 맞는 차량 목록 반환
router.get(
  "/getInventory/:classification_id",
  Util.handleErrors(invController.getInventoryJSON)
);

// Route to display edit inventory view
router.get("/edit/:inv_id", invController.editInventoryView);
router.post(
  "/update",
  invValidation.checkUpdateData,
  invController.updateInventory
);

// Route to display delete confirm view
router.get("/delete/:inv_id", invController.getDeleteConfirmView);

// 삭제 처리 (POST)
router.post("/delete", invController.deleteInventoryItem);

module.exports = router;
