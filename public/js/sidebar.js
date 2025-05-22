const toggleBtn = document.getElementById("toggleSidebarBtn");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("mainContent");

const modal = document.getElementById("chatOptionsModal");
const chatIdInput = document.getElementById("chatId");
const newTitleInput = document.getElementById("newTitle");
const deleteBtnList = document.querySelectorAll("#deleteChatBtn");
const renameForm = document.getElementById("renameForm");


toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("expanded");
});

// Khi mở modal, lấy data-chat-id và title từ nút
modal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const chatId = button.getAttribute("data-id");
    const chatTitle = button.getAttribute("data-name");

    chatIdInput.value = chatId;
    newTitleInput.value = chatTitle;
});

// Gửi yêu cầu đổi tên
renameForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const chatId = chatIdInput.value;
    const newTitle = newTitleInput.value.trim();

    if (newTitle) {
        let res = await fetch(`/users/chat/rename/${chatId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
        });
        let result = await res.json();
        if (result.isSuccess) {
            location.href = window.location.href;
        };
    };
});

// Gửi yêu cầu xóa chat
deleteBtnList.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", async () => {
        const chatId = deleteBtn.getAttribute("data-id");

        if (confirm("Are you sure you want to delete this chat?")) {
            let res = await fetch(`/users/chat/delete/${chatId}`, {
                method: "DELETE",
            });
            let result = await res.json();
            if (result.isSuccess) {
                location.href = '/';
            };
        };
    });
})

