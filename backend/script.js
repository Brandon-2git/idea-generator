const textarea = document.getElementById("prompt");
const wordCount = document.getElementById("wordCount");
const sendBtn = document.getElementById("sendBtn");
const responseDiv = document.getElementById("response");

textarea.addEventListener("input", () => {
    const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);

    if (words.length > 30) {
        textarea.value = words.slice(0, 30).join(" ");
    }

    const currentCount = textarea.value
        .trim()
        .split(/\s+/)
        .filter(w => w.length > 0).length;

    wordCount.textContent = `${currentCount} / 30 palabras`;
});

sendBtn.addEventListener("click", sendPrompt);

async function sendPrompt() {
    const prompt = textarea.value.trim();
    if (!prompt) {
        alert("Escribe algo.");
        return;
    }

    responseDiv.innerText = "Procesando...";

    try {
        const res = await fetch("https://TU_API_ENDPOINT_AQUI", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        const words = data.message.split(/\s+/);

        if (words.length > 15) {
            responseDiv.innerText = "Respuesta inválida del servidor.";
        } else {
            responseDiv.innerText = data.message;
        }

    } catch (err) {
        responseDiv.innerText = "Error al conectar con el backend.";
    }
}