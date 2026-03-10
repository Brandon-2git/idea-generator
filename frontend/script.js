const textarea = document.getElementById("prompt");
const wordCount = document.getElementById("wordCount");
const sendBtn = document.getElementById("sendBtn");
const responseDiv = document.getElementById("response");
const status = document.getElementById("status"); // NUEVO: div de estado

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

    // NUEVO: Cambiar estado a "Procesando" y estilos
    status.textContent = "Procesando...";
    status.style.background = "#FFF2CC";
    status.style.color = "#A66100";

    // NUEVO: Bloquear botón y cambiar estilos
    sendBtn.textContent = "Generando...";
    sendBtn.disabled = true;
    sendBtn.style.background = "#CCCCCC";
    sendBtn.style.color = "#707070";
    sendBtn.style.cursor = "not-allowed";

    responseDiv.innerText = "Generando ideas...";

    try {
        // Se realiza la petición http al endpoint de la API que esta desplegada en AWS 
        const res = await fetch("https://", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        // Convierte la respuesta de la petición http a objeto json
        const data = await res.json();

        // Separa el mensaje recibido en palabras usando espacios como delimitadores
        const words = data.result.split(/\s+/);
        responseDiv.innerText = words.length > 15 ? "Respuesta inválida del servidor." : data.result;
        

    } catch (err) {
        responseDiv.innerText = "Error al conectar con el backend.";
    } finally {
        // NUEVO: Restaurar estado y botón después de generar
        status.textContent = "Estado inicial";
        status.style.background = "#d7e5ff";
        status.style.color = "#3b5ed7";

        sendBtn.textContent = "✏ Generar Ideas";
        sendBtn.disabled = false;
        sendBtn.style.background = "linear-gradient(90deg,#5f6cff,#6f5eff)";
        sendBtn.style.color = "white";
        sendBtn.style.cursor = "pointer";
    }
}