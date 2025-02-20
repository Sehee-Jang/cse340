const express = require("express");
const QuestionController = require("../controllers/questionController");
const router = express.Router();
const Util = require("../utilities/");

// Add a new question
router.post("/add", QuestionController.addQuestion);

// Get questions by inventory ID
router.get(
  "/inv/detail/:inv_id/questions",
  QuestionController.getQuestionsByInventory
);

// Get questions by account ID
router.get(
  "/account/:account_id/questions",
  QuestionController.getQuestionsByAccount
);

// Answer a question
router.post("/answer/:question_id", Util.checkLogin, Util.checkAdminOrEmployee, QuestionController.answerQuestion);

// Delete a question
router.get(
  "/delete/:question_id",
  Util.checkLogin,
  Util.checkAdminOrEmployee,
  QuestionController.deleteQuestion
);

module.exports = router;
