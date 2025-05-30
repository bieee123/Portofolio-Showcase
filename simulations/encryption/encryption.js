let encryptionKey = null; // Simpan kunci agar tetap digunakan untuk enkripsi & dekripsi

// Generate AES-256-GCM key (hanya sekali saat halaman dimuat)
async function generateKey() {
    if (!encryptionKey) {
        encryptionKey = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
        const exportedKey = await crypto.subtle.exportKey("raw", encryptionKey);
        const keyBase64 = btoa(String.fromCharCode(...new Uint8Array(exportedKey)));
        document.getElementById("key-display").textContent = keyBase64;
    }
    return encryptionKey;
}

// Encrypt data
async function encryptData() {
    const key = await generateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12)); // Random Initialization Vector
    const data = document.getElementById("data").value.trim(); // Hapus spasi di awal & akhir

    if (!data) {
        showStatus("error", "Please enter text to encrypt!");
        return;
    }

    const encodedData = new TextEncoder().encode(data);
    const encryptedData = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        key,
        encodedData
    );

    // Konversi ke Base64
    const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
    const ivBase64 = btoa(String.fromCharCode(...iv));

    document.getElementById("encrypted-text").textContent = `${ivBase64}:${encryptedBase64}`;
    showStatus("success", "Data encrypted successfully!");
}

// Decrypt data
async function decryptData() {
    const key = await generateKey();
    const encryptedText = document.getElementById("encrypted-text").textContent.trim();

    if (!encryptedText || encryptedText === "No encrypted data yet") {
        showStatus("error", "No encrypted data to decrypt!");
        return;
    }

    try {
        const [ivBase64, encryptedBase64] = encryptedText.split(":");
        const iv = new Uint8Array(atob(ivBase64).split("").map(char => char.charCodeAt(0)));
        const encryptedData = new Uint8Array(atob(encryptedBase64).split("").map(char => char.charCodeAt(0)));

        const decryptedData = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            key,
            encryptedData
        );

        document.getElementById("decrypted-text").textContent = new TextDecoder().decode(decryptedData);
        showStatus("success", "Data decrypted successfully!");
    } catch (error) {
        showStatus("error", "Decryption failed! Invalid key or data.");
    }
}

// Copy text to clipboard (tanpa spasi berlebih & tombol copy)
function copyToClipboard(elementId) {
    const textElement = document.getElementById(elementId);
    const text = textElement.textContent.trim(); // Ambil hanya teks, tanpa tombol copy

    navigator.clipboard.writeText(text).then(() => {
        showStatus("success", "Copied to clipboard!");
    }).catch(() => {
        showStatus("error", "Failed to copy text.");
    });
}

// Reset semua input dan output
function resetAll() {
    document.getElementById("data").value = "";
    document.getElementById("encrypted-text").textContent = "No encrypted data yet";
    document.getElementById("decrypted-text").textContent = "No decrypted data yet";
    showStatus("success", "Reset complete!");
}

// Menampilkan status pesan
function showStatus(type, message) {
    const statusDiv = document.getElementById("status");
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
}

// Drag & Drop fitur
function enableDragAndDrop() {
    const textArea = document.getElementById("data");

    textArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        textArea.classList.add("animation");
    });

    textArea.addEventListener("dragleave", () => {
        textArea.classList.remove("animation");
    });

    textArea.addEventListener("drop", (event) => {
        event.preventDefault();
        textArea.classList.remove("animation");

        if (event.dataTransfer.items) {
            const item = event.dataTransfer.items[0];

            if (item.kind === "file") {
                const file = item.getAsFile();
                const reader = new FileReader();

                reader.onload = function (e) {
                    textArea.value = e.target.result;
                    showStatus("success", "File content loaded!");
                };

                reader.readAsText(file);
            } else {
                textArea.value = event.dataTransfer.getData("text");
                showStatus("success", "Text dropped successfully!");
            }
        }
    });
}

// Inisialisasi saat halaman dimuat
window.onload = function () {
    generateKey();
    enableDragAndDrop();
};
