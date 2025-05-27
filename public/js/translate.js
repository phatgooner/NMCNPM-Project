// Tra nghĩa khi click vào từ
async function showDefinition(word) {
    try {
        const res = await fetch(`/translate/${word}`);
        const result = await res.json();

        if (!result.success) throw new Error(result.message);

        const entry = JSON.parse(result.data);
        console.log(entry.phonetic)
        const meanings = entry.meanings.map(meaning => {
            const defs = meaning.definitions.map(def => `
                <li class="px-2"><strong>Nghĩa:</strong> ${def.definition}
                ${def.synonyms.length > 0 ? `<br><span class="text-decoration-underline">Đồng nghĩa</span>: ${def.synonyms.join(", ")}` : ""}
                ${def.antonyms.length > 0 ? `<br><span class="text-decoration-underline">Trái nghĩa</span>: ${def.antonyms.join(", ")}` : ""}
                ${def.example ? `<br><em><span class="text-decoration-underline">Ví dụ</span>: "${def.example}"</em>` : ""}                
                </li>
            `).join("");
            return `<p><strong>Loại từ:</strong> ${meaning.partOfSpeech}</p><ol>${defs}</ol>`;
        }).join("");

        let content = `
            <p><strong>Từ:</strong> ${entry.word}</p>
            <p><strong>Phát âm:</strong> ${entry.phonetic.text} <button class="btn speak-btn mb-1" data-text="${entry.phonetic.audio}"> 🔊 </button> </p>
            ${meanings}`;

        document.getElementById("modalContent").innerHTML = content;
        new bootstrap.Modal(document.getElementById("wordModal")).show();

    } catch (err) {
        document.getElementById("modalContent").innerHTML = `<p class="text-danger">Không tìm thấy định nghĩa cho từ: <strong>${word}</strong></p>`;
        new bootstrap.Modal(document.getElementById("wordModal")).show();
    }
};