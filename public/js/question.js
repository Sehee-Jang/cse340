document.addEventListener("DOMContentLoaded", async () => {
  const invIdElement = document.querySelector("input[name='inv_id']");
  if (!invIdElement) return; // invId 요소가 없으면 실행 안 함

  const invId = invIdElement.value;
  const questionList = document.getElementById("question-list");

  try {
    const response = await fetch(`/questions/inv/detail/${invId}/questions`);
    const questions = await response.json();

    questionList.innerHTML = ""; // 기존 내용을 지우고 새로 추가

    if (questions.length > 0) {
      questions.forEach((question) => {
        const questionItem = document.createElement("li");
        questionItem.innerHTML = `
          <strong>Q:</strong> ${question.question_text} 
          ${
            question.answer_text
              ? `<p><strong>A:</strong> ${question.answer_text}</p>`
              : `<p><em>No answer yet.</em></p>
                <button class="reply-button" data-question-id="${question.question_id}">Reply</button>
                <div class="reply-form-container" id="reply-form-${question.question_id}" style="display: none;">
                  <textarea class="reply-textarea" data-question-id="${question.question_id}" placeholder="Write an answer..."></textarea>
                  <button class="submit-reply" data-question-id="${question.question_id}">Submit</button>
                </div>`
          }
        `;
        questionList.appendChild(questionItem);
      });

      // 댓글 버튼 이벤트 리스너 추가
      document.querySelectorAll(".reply-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          const questionId = event.target.getAttribute("data-question-id");
          const replyForm = document.getElementById(`reply-form-${questionId}`);
          replyForm.style.display =
            replyForm.style.display === "none" ? "block" : "none";
        });
      });

      // 답변 제출 버튼 이벤트 리스너 추가
      document.querySelectorAll(".submit-reply").forEach((button) => {
        button.addEventListener("click", async (event) => {
          const questionId = event.target.getAttribute("data-question-id");
          const replyTextarea = document.querySelector(
            `.reply-textarea[data-question-id="${questionId}"]`
          );
          const answerText = replyTextarea.value.trim();

          if (answerText) {
            try {
              const response = await fetch(`/questions/answer/${questionId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer_text: answerText }),
              });

              if (response.ok) {
                location.reload(); // 페이지 새로고침하여 답변 표시
              } else {
                console.error("Failed to submit answer.");
              }
            } catch (error) {
              console.error("Error submitting answer:", error);
            }
          }
        });
      });
    } else {
      questionList.innerHTML = "<li>No questions yet.</li>";
    }
  } catch (error) {
    console.error("Failed to load questions.", error);
  }
});
