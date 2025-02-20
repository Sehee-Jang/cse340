const pool = require("../database/index");

/* *****************************
 *   Add a new review
 * *************************** */
async function addReview(account_id, inv_id, rating, review_text) {
  try {
    const sql =
      "INSERT INTO reviews (account_id, inv_id, rating, review_text) VALUES ($1, $2, $3, $4) RETURNING *";
    return await pool.query(sql, [account_id, inv_id, rating, review_text]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get reviews by inventory ID
 * *************************** */
async function getReviewsByInventory(inv_id) {
  try {
    const sql = "SELECT * FROM reviews WHERE inv_id = $1";
    const result = await pool.query(sql, [inv_id]);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Get reviews by account ID
 * *************************** */
async function getReviewsByAccount(account_id) {
  try {
    const sql = "SELECT * FROM reviews WHERE account_id = $1";
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Update a review
 * *************************** */
async function updateReview(review_id, rating, review_text) {
  try {
    const sql =
      "UPDATE reviews SET rating = $1, review_text = $2 WHERE review_id = $3";
    await pool.query(sql, [rating, review_text, review_id]);
    return { success: true, message: "Review updated successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

/* *****************************
 *   Delete a review
 * *************************** */
async function deleteReview(review_id) {
  try {
    const sql = "DELETE FROM reviews WHERE review_id = $1";
    await pool.query(sql, [review_id]);
    return { success: true, message: "Review deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = {
  addReview,
  getReviewsByInventory,
  getReviewsByAccount,
  updateReview,
  deleteReview,
};
