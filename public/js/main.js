const sendBtn = document.getElementById("sendBtn");
const inputText = document.getElementById("inputText");
const chatArea = document.getElementById("chatArea");

// Gửi tin nhắn và đợi phản hồi từ AI
sendBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) return;

    appendMessage("You", text);
    inputText.value = "";
    chatArea.scrollTop = chatArea.scrollHeight;

    try {
        const response = await fetch("/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
        });
        const data = await response.json();
        appendMessage("Assistant", data.reply);
        renderSuggestions(data.suggestions);
    } catch (err) {
        console.error("Failed to get response from server:", err);
    }
});

// Gửi tin nhắn bằng phím Enter
inputText.addEventListener("keydown", async (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault(); // Ngăn xuống dòng
        sendBtn.click();    // Gọi hàm gửi tin nhắn
    }
});

// Hiển thị tin nhắn và highlight từ
function appendMessage(sender, message) {
    const bubble = document.createElement("div");
    bubble.className = `mb-2 p-2 rounded ${sender === "You" ? "bg-primary text-white text-end" : "bg-white border"
        }`;
    bubble.innerHTML = `<strong>${sender}:</strong> ${highlightWords(message)} <button class="btn btn-sm ms-2 mb-1 speak-btn" data-text="${message}" title="Nghe">
            🔊
        </button>`;
    chatArea.appendChild(bubble);
    chatArea.scrollTop = chatArea.scrollHeight;
};

// Highlight từ
function highlightWords(text) {
    return text.replace(/\b([\p{L}\p{M}]+)\b/gu, (word) => {
        return `<span class="word" onclick="showDefinition('${word}')">${word}</span>`;
    });
};

//Gợi ý câu hỏi
function renderSuggestions(suggestions) {
    const container = document.getElementById("suggestions");
    container.innerHTML = "";
    suggestions.forEach(suggestion => {
        const btn = document.createElement("button");
        btn.textContent = suggestion.replace(/^\d+\.\s*/, "");
        btn.className = "btn btn-outline-secondary my-1 text-start";
        btn.onclick = () => {
            inputText.value = btn.textContent;
        };
        container.appendChild(btn);
    });
};
