// Tra nghĩa khi click vào từ
async function showDefinition(word) {
    try {
        const res = await fetch(`/translate/${word}`);
        const result = await res.json();

        if (!result.success) throw new Error(result.message);

        const entry = result.data[0];
        const meanings = entry.meanings.map(meaning => {
            const defs = meaning.definitions.map(def => `
                <li><strong>Definition:</strong> ${def.definition}
                ${def.example ? `<br><em>Example:</em> "${def.example}"` : ""}
                </li>
            `).join("");
            return `<p><strong>Part of speech:</strong> ${meaning.partOfSpeech}</p><ul>${defs}</ul>`;
        }).join("");

        const content = `
            <p><strong>Word:</strong> ${entry.word}</p>
            ${entry.phonetic ? `<p><strong>Phonetic:</strong> ${entry.phonetic}</p>` : ""}
            ${meanings}
        `;

        document.getElementById("modalContent").innerHTML = content;
        new bootstrap.Modal(document.getElementById("wordModal")).show();

    } catch (err) {
        document.getElementById("modalContent").innerHTML = `<p class="text-danger">Không tìm thấy định nghĩa cho từ: <strong>${word}</strong></p>`;
        new bootstrap.Modal(document.getElementById("wordModal")).show();
    }
};