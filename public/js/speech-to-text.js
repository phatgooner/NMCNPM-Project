const recordBtn = document.getElementById("recordBtn");

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
        document.getElementById("inputText").value = transcript;
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
};

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

// Tự động dừng nếu im lặng quá 5 giây
function resetSilenceTimer() {
    clearTimeout(silenceTimeout);
    silenceTimeout = setTimeout(() => {
        console.log("Silence detected: stopping recording...");
        stopRecording();
    }, 5000); // 5 giây im lặng thì dừng
};

// Dừng ghi âm
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        recordBtn.textContent = "🎙️ Record";
        clearTimeout(silenceTimeout);
    };
};