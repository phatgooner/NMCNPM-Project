const recordBtn = document.getElementById("recordBtn");

let isRecording = false;
let recognition;

// Khởi tạo Web Speech API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join(" ");
        document.getElementById("inputText").value = transcript;
        stopRecording();
    };

    recognition.onend = () => {
        isRecording = false;
        recordBtn.textContent = "🎙️ Record";
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
    } else {
        stopRecording();
    }
});

// Dừng ghi âm
function stopRecording() {
    if (recognition && isRecording) {
        recognition.stop();
        isRecording = false;
        recordBtn.textContent = "🎙️ Record";
    };
};