$(document).ready(async function () {
  const categorySelect = $("#category-select");
  const categoryButtons = $("#category-buttons");
  const threadContainer = $("#threads-container");

  // カテゴリのロード
  async function loadCategories() {
    try {
      const response = await fetch("/api/categories");
      const categories = await response.json();
      categories.forEach((category) => {
        categorySelect.append(new Option(category.name, category._id));
        categoryButtons.append(`
          <button class="btn btn-secondary m-1 category-button" data-id="${category._id}">${category.name}</button>
        `);
      });

      // カテゴリボタンのクリックイベント
      $(".category-button").click(function () {
        const categoryId = $(this).data("id");
        loadThreads(categoryId);
      });
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  // スレッドのロード
  async function loadThreads(categoryId) {
    try {
      threadContainer.empty();
      const response = await fetch(`/api/categories/${categoryId}/threads`);
      const threads = await response.json();
      console.log("Loaded threads:", threads); // デバッグ用ログ

      threads.forEach((thread) => {
        const threadElement = $(`
          <div class="thread">
            <h3><a href="/thread/${thread._id}">${thread.title}</a></h3>
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
                    Date: ${new Date(comment.createdAt).toLocaleString(
                      "ja-JP",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        weekday: "short",
                      }
                    )}<br>
                    Name: ${comment.name}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
            <form class="new-comment-form">
              <input type="text" name="content" class="form-control" placeholder="Add a comment">
              <button type="submit" class="btn btn-secondary btn-block mt-2">Add Comment</button>
            </form>
          </div>
        `);
        threadContainer.append(threadElement);

        // コメント追加フォームのハンドリング
        threadElement.find(".new-comment-form").submit(async function (e) {
          e.preventDefault();
          const content = $(this).find("input[name='content']").val();
          const name = $(this).find("input[name='name']").val() || "匿名";
          try {
            const response = await fetch(
              `/api/threads/${thread._id}/comments`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content, name }),
              }
            );
            const newComment = await response.json();
            threadElement.find(".comments").append(`
              <div class="comment">
                <p>${newComment.content}</p>
                <div class="comment-meta">
                  No: ${thread.comments.length + 1}<br>
                  Date: ${new Date(newComment.createdAt).toLocaleString(
                    "ja-JP",
                    {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      weekday: "short",
                    }
                  )}<br>
                  Name: ${newComment.name}
                </div>
              </div>
            `);
            $(this).find("input[name='content']").val("");
            $(this).find("input[name='name']").val("");
          } catch (error) {
            console.error("Error adding comment:", error);
          }
        });
      });
    } catch (error) {
      console.error("Error loading threads:", error);
    }
  }

  // 初期ロード
  await loadCategories();

  // 新しいスレッド作成フォームのハンドリング
  $("#new-thread-form").submit(async function (e) {
    e.preventDefault();
    const title = $("#new-thread-title").val();
    const description = $("#new-thread-description").val();
    const category = categorySelect.val();
    try {
      const response = await fetch("/api/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, category }),
      });
      const newThread = await response.json();
      console.log("Created new thread:", newThread); // デバッグ用ログ
      loadThreads(category);
      $("#new-thread-title").val("");
      $("#new-thread-description").val("");
    } catch (error) {
      console.error("Error creating thread:", error);
    }
  });
});
