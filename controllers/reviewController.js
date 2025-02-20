const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const ReviewController = {};

/* *****************************
 *   Add a new review
 * *************************** */
ReviewController.addReview = async function (req, res) {
  const { account_id, inv_id, rating, review_text } = req.body;
  try {
    const result = await reviewModel.addReview(
      account_id,
      inv_id,
      rating,
      review_text
    );
    if (result.rowCount > 0) {
      req.flash("success", "Review added successfully.");
    } else {
      req.flash("error", "Failed to add review.");
    }
    res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/* *****************************
 *   Get reviews by inventory ID
 * *************************** */
ReviewController.getReviewsByInventory = async function (req, res) {
  const { inv_id } = req.params;
  try {
    const reviews = await reviewModel.getReviewsByInventory(inv_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* *****************************
 *   Get reviews by account ID
 * *************************** */
ReviewController.getReviewsByAccount = async function (req, res) {
  const { account_id } = req.params;
  try {
    const reviews = await reviewModel.getReviewsByAccount(account_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* *****************************
 *   Update a review
 * *************************** */
ReviewController.updateReview = async function (req, res) {
  const { review_id, rating, review_text } = req.body;
  try {
    const result = await reviewModel.updateReview(
      review_id,
      rating,
      review_text
    );
    if (result.success) {
      req.flash("success", result.message);
    } else {
      req.flash("error", "Failed to update review.");
    }
    res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

/* *****************************
 *   Delete a review
 * *************************** */
ReviewController.deleteReview = async function (req, res) {
  const { review_id } = req.params;
  try {
    const result = await reviewModel.deleteReview(review_id);
    if (result.success) {
      req.flash("success", result.message);
    } else {
      req.flash("error", "Failed to delete review.");
    }
    res.redirect("back");
  } catch (error) {
    req.flash("error", error.message);
    res.redirect("back");
  }
};

module.exports = ReviewController;
