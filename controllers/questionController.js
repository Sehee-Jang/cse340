const QuestionModel = require("../models/question-model");

const QuestionController = {};

/* *****************************
 *   Add a new question
 * *************************** */
QuestionController.addQuestion = async function (req, res) {
  const { inv_id, question_text } = req.body;

  const account_id = req.session.user ? req.session.user.account_id : null;

  try {
    const result = await QuestionModel.addQuestion(
      account_id,
      inv_id,
      question_text
    );
    if (result.rowCount > 0) {
      req.flash("success", "Question added successfully.");
    } else {
      req.flash("error", "Failed to add question.");
    }
    res.redirect(`/inv/detail/${inv_id}`);
  } catch (error) {
    req.flash("error", error.message);
    res.redirect(`/inv/detail/${inv_id}`);
  }
};

/* *****************************
 *   Get questions by inventory ID
 * *************************** */
QuestionController.getQuestionsByInventory = async function (req, res) {
  const { inv_id } = req.params;
  try {
    const questions = await QuestionModel.getQuestionsByInventory(inv_id);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* *****************************
 *   Get questions by account ID
 * *************************** */
QuestionController.getQuestionsByAccount = async function (req, res) {
  const { account_id } = req.params;
  try {
    const questions = await QuestionModel.getQuestionsByAccount(account_id);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* *****************************
 *   Answer a question
 * *************************** */
QuestionController.answerQuestion = async function (req, res) {
  const { question_id } = req.params; // URL 파라미터에서 question_id 가져옴
  const { answer_text } = req.body; // 요청 바디에서 answer_text 가져옴
  const account_id = req.session.user ? req.session.user.account_id : null; // 로그인한 사용자 ID 가져오기

  if (!account_id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const result = await QuestionModel.answerQuestion(question_id, answer_text);
    if (result.success) {
      res.json({ success: true, message: "Answer submitted successfully." });
    } else {
      res
        .status(500)
        .json({ success: false, message: "Failed to submit answer." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* *****************************
 *   Delete a question
 * *************************** */
QuestionController.deleteQuestion = async function (req, res) {
  const { question_id } = req.params;
  try {
    const result = await QuestionModel.deleteQuestion(question_id);
    if (result.success) {
      req.flash("success", result.message);
    } else {
      req.flash("error", "Failed to delete question.");
    }
    res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

module.exports = QuestionController;
