const express = require("express");
const ReviewController = require("../controllers/ReviewController");
const router = express.Router();

// Add a new review
router.post("/add", ReviewController.addReview);

// Get reviews by inventory ID
router.get(
  "/inv/detail/:inv_id/reviews",
  ReviewController.getReviewsByInventory
);

// Get reviews by account ID
router.get("/account/:account_id", ReviewController.getReviewsByAccount);

// Update a review
router.post("/update/:review_id", ReviewController.updateReview);

// Delete a review
router.get("/delete/:review_id", ReviewController.deleteReview);

module.exports = router;
