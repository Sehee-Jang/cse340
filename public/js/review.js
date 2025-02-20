document.addEventListener("DOMContentLoaded", async () => {
  const invId = "<%= inv_id %>";
  const reviewList = document.getElementById("review-list");

  try {
    const response = await fetch(`/inv/detail/${invId}/reviews`);
    const reviews = await response.json();

    if (reviews.length > 0) {
      reviews.forEach((review) => {
        const reviewItem = document.createElement("li");
        reviewItem.innerHTML = `
            <strong>User ID:</strong> ${review.account_id} 
            <strong>Rating:</strong> ${review.rating}/5
            <p>${review.review_text}</p>
            <small>Posted on: ${new Date(
              review.created_at
            ).toLocaleString()}</small>`;
        reviewList.appendChild(reviewItem);
      });
    } else {
      reviewList.innerHTML = "<p>No reviews available.</p>";
    }
  } catch (error) {
    console.error("Failed to load review data.", error);
  }
});
