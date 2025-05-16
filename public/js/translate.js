// Tra nghĩa khi click vào từ
async function showDefinition(word) {
    try {
        const res = await fetch(`/translate/${word}`);
        const result = await res.json();

        if (!result.success) throw new Error(result.message);

        const entry = result.data[0];
        const meanings = entry.meanings.map(meaning => {
            const defs = meaning.definitions.map(def => `
                <li class="px-2"><strong>Definition:</strong> ${def.definition}
                ${def.example ? `<br><em><span class="text-decoration-underline">Example</span>: "${def.example}"</em>` : ""}
                </li>
            `).join("");
            return `<p><strong>Part of speech:</strong> ${meaning.partOfSpeech}</p><ol>${defs}</ol>`;
        }).join("");

        let content = '';
        let phonetic = entry.phonetics.find(item => item.audio && item.text);

        if (phonetic) {
            entry.phonetic = phonetic;
            content = `
                <p><strong>Word:</strong> ${entry.word}</p>
                ${entry.phonetic.text ? `<p><strong>Phonetic:</strong> ${entry.phonetic.text} <button class="btn play-audio-btn" data-audio-url="${entry.phonetic.audio}"> 🔊 </button> </p>` : ""}
                ${meanings}
            `;
        } else {
            content = `
                <p><strong>Word:</strong> ${entry.word}</p>
                ${entry.phonetic ? `<p><strong>Phonetic:</strong> ${entry.phonetic}` : ""}
                ${meanings}
            `;
        };

        document.getElementById("modalContent").innerHTML = content;
        new bootstrap.Modal(document.getElementById("wordModal")).show();

    } catch (err) {
        document.getElementById("modalContent").innerHTML = `<p class="text-danger">Không tìm thấy định nghĩa cho từ: <strong>${word}</strong></p>`;
        new bootstrap.Modal(document.getElementById("wordModal")).show();
    }
};

//Phát âm thanh từ vựng khi click vào biểu tượng loa
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("play-audio-btn")) {
        const audioUrl = e.target.getAttribute("data-audio-url");

        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch(err => console.error("Audio error:", err));
        }
    }
});