const recordBtn = document.getElementById("recordBtn");
const sendBtn = document.getElementById("sendBtn");
const inputText = document.getElementById("inputText");
const chatArea = document.getElementById("chatArea");

let isRecording = false;
let recognition;
let silenceTimeout;

// Khởi tạo Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";  // hoặc "vi-VN" nếu bạn muốn tiếng Việt
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
        inputText.value = transcript;
        resetSilenceTimer(); // Có giọng nói -> reset bộ đếm im lặng
    };

    recognition.onend = () => {
        isRecording = false;
        recordBtn.textContent = "🎙️ Record";
        clearTimeout(silenceTimeout);
        console.log("Speech recognition ended");
    };

    recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
    };
} else {
    alert("Your browser does not support Speech Recognition.");
}

// Nút ghi âm
recordBtn.addEventListener("click", () => {
    if (!recognition) return;

    if (!isRecording) {
        recognition.start();
        isRecording = true;
        recordBtn.textContent = "⏹️ Stop";
        resetSilenceTimer(); // bắt đầu đếm im lặng
    } else {
        stopRecording();
    }
});

// Tự động dừng nếu im lặng quá 2.5 giây
function resetSilenceTimer() {
    clearTimeout(silenceTimeout);
    silenceTimeout = setTimeout(() => {
        console.log("Silence detected: stopping recording...");
        stopRecording();
    }, 2500); // 2.5 giây im lặng thì dừng
}

function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        recordBtn.textContent = "🎙️ Record";
        clearTimeout(silenceTimeout);
    }
}

// Nút gửi
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
}

// Highlight từ
function highlightWords(text) {
    return text.replace(/\b([\p{L}\p{M}]+)\b/gu, (word) => {
        return `<span class="word" onclick="showDefinition('${word}')">${word}</span>`;
    });
};