const pool = require("../database/index");

/* *****************************
 *   Add a new question
 * *************************** */
async function addQuestion(account_id, inv_id, question_text) {
  try {
    const sql =
      "INSERT INTO questions (account_id, inv_id, question_text) VALUES ($1, $2, $3) RETURNING *";
    return await pool.query(sql, [account_id, inv_id, question_text]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get questions by inventory ID
 * *************************** */
async function getQuestionsByInventory(inv_id) {
  try {
    const sql =
      "SELECT * FROM questions WHERE inv_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get questions by account ID
 * *************************** */
async function getQuestionsByAccount(account_id) {
  try {
    const sql =
      "SELECT * FROM questions WHERE account_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Answer a question
 * *************************** */
async function answerQuestion(question_id, answer_text) {
  try {
    const sql =
      "UPDATE questions SET answer_text = $1, answered_at = NOW() WHERE question_id = $2";
    await pool.query(sql, [answer_text, question_id]);
    return { success: true, message: "Answer submitted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/* *****************************
 *   Delete a question
 * *************************** */
async function deleteQuestion(question_id) {
  try {
    const sql = "DELETE FROM questions WHERE question_id = $1";
    await pool.query(sql, [question_id]);
    return { success: true, message: "Question deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  addQuestion,
  getQuestionsByInventory,
  getQuestionsByAccount,
  answerQuestion,
  deleteQuestion,
};
