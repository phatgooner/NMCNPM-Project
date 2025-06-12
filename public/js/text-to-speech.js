//Bắt sự kiện khi click vào nút loa
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("speak-btn")) {
        const text = e.target.getAttribute("data-text");
        speakText(text);
    }
});

// Đọc text khi click vào biểu tượng loa
function speakText(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        speechSynthesis.speak(utterance);
    } else {
        alert("Your browser does not support Text-to-Speech.");
    }
};