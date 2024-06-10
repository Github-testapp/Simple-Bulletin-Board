document.addEventListener("DOMContentLoaded", async function () {
  const threadContainer = document.getElementById("thread-container");

  async function loadThread() {
    try {
      const response = await fetch(`/api/threads/${threadId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const thread = await response.json();
      console.log("Loaded thread:", thread); // デバッグ用ログ

      const threadElement = document.createElement("div");
      threadElement.classList.add("thread");
      threadElement.innerHTML = `
        <h3>${thread.title}</h3>
        <p>${thread.description}</p>
        <p>作成日時: ${new Date(thread.createdAt).toLocaleString("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          weekday: "short",
        })}</p>
        <div class="comments">
          ${thread.comments
            .map(
              (comment, index) => `
            <div class="comment">
              <p>${comment.content}</p>
              <div class="comment-meta">
                No: ${index + 1}<br>
                Date: ${new Date(comment.createdAt).toLocaleString("ja-JP", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  weekday: "short",
                })}<br>
                Name: ${comment.name}
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
      threadContainer.appendChild(threadElement);

      const form = document.getElementById("new-comment-form");
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const content = document.getElementById("new-comment-content").value;
        const name = "匿名"; // 名前フィールドをデフォルトで「匿名」に設定
        try {
          const response = await fetch(`/api/threads/${threadId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content, name }),
          });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const newComment = await response.json();
          const newCommentElement = document.createElement("div");
          newCommentElement.classList.add("comment");
          newCommentElement.innerHTML = `
            <p>${newComment.content}</p>
            <div class="comment-meta">
              No: ${thread.comments.length + 1}<br>
              Date: ${new Date(newComment.createdAt).toLocaleString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                weekday: "short",
              })}<br>
              Name: ${newComment.name}
            </div>
          `;
          document.querySelector(".comments").appendChild(newCommentElement);
          thread.comments.push(newComment); // コメントをローカルにも追加
          document.getElementById("new-comment-content").value = "";
        } catch (error) {
          console.error("Error adding comment:", error);
        }
      });
    } catch (error) {
      console.error("Error loading thread:", error);
    }
  }

  await loadThread();
});
