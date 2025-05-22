const sendBtn = document.getElementById("sendBtn");
const inputText = document.getElementById("inputText");
const chatArea = document.getElementById("chatArea");

// Gửi tin nhắn và đợi phản hồi từ AI
sendBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    let userId = chatArea.getAttribute('data-id');

    if (!text) return;
    displayChat();
    unableSubmit(true);
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
        if (userId) {
            await createNewChat(text, data.reply);
        } else {
            renderSuggestions(data.suggestions);
            chatArea.style = 'height: 450px';
            unableSubmit(false);
        }
    } catch (err) {
        console.error("Failed to get response from server:", err);
    }
});

// Hiển thị khung chat
function displayChat() {
    document.getElementById('welcome').hidden = true;
    chatArea.hidden = false;
    chatArea.style = 'height: 650px';
};

// Lock input và button
function unableSubmit(isUnabled) {
    sendBtn.disabled = isUnabled;
    inputText.disabled = isUnabled;
};

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
    if (sender === 'You') {
        bubble.className = 'my-4 text-end right-middle';
        bubble.innerHTML = `<button class="btn btn-sm speak-btn" data-text="${message}" title="Nghe">🔊</button> <div class='text-justify chat-bubble text-start d-inline-block px-4 py-2 rounded-pill text-break bg-primary'>${highlightWords(message)}</div>`;
    }
    else {
        bubble.className = 'my-4';
        bubble.innerHTML = `<div class='text-justify bg-white'>${highlightWords(message)}<button style="margin-bottom:3px" class="speak-btn btn btn-sm ms-2" data-text="${message}" title="Nghe">🔊</button></div>`;
    };
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

async function createNewChat(userMessage, assistantMessage) {
    let conversation = {
        userMessage,
        assistantMessage
    }
    let res = await fetch("/users/chat/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conversation),
    });
    let result = await res.json();
    if (result.isSuccess) {
        location.href = `/users/chat/${result.newChatId}`
    }
    else {
        location.href = '/';
    }
}
