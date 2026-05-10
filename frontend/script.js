const textarea = document.getElementById("prompt");
const wordCount = document.getElementById("wordCount");
const sendBtn = document.getElementById("sendBtn");
const responseDiv = document.getElementById("response");
const status = document.getElementById("status");
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Contador de palabras (Límite de 30)
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

// Evento del botón
sendBtn.addEventListener("click", sendPrompt);

// Función principal
async function sendPrompt() {
    const prompt = textarea.value.trim();
    if (!prompt) {
        alert("Por favor, escribe una idea primero.");
        return;
    }

    // Configuración de estado: Procesando
    status.textContent = "⏳ Procesando...";
    status.className = "status loading";

    // Bloquear botón y estilos de carga
    sendBtn.textContent = "Generando...";
    sendBtn.disabled = true;
    sendBtn.style.background = "#CCCCCC";
    sendBtn.style.color = "#707070";
    sendBtn.style.cursor = "not-allowed";

    // Limpiar área de respuesta y mostrar mensaje temporal
    responseDiv.className = "response";
    responseDiv.innerHTML = "Generando ideas...";

    const API_URL = "URL_DEL_ENDPOINT";

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt })
        });

        const data = await res.json();

        if (!data.result) {
            throw new Error("Respuesta inválida del servidor.");
        }

        // Validación de longitud (opcional, según tu lógica previa)
        const words = data.result.split(/\s+/);
        if (words.length > 50) { // Ajustado para dar más margen a las ideas
            throw new Error("Respuesta demasiado larga");
        }

        // Estado de éxito
        status.textContent = "✅ Listo";
        status.className = "status";
        responseDiv.className = "response success";
        responseDiv.innerHTML = ""; // Limpiar el "Generando ideas..."

        const negativaIA = ["perdón", "lo siento", "no puedo", "intenta de nuevo"];
        const esErrorSemantico = negativaIA.some(frase => data.result.toLowerCase().includes(frase));

        if (esErrorSemantico) {
            // Si la IA respondió que no puede, lo mostramos como un mensaje simple, no como tarjetas
            responseDiv.className = "response error"; 
            responseDiv.innerText = data.result; // Muestra el mensaje de la IA completo
            status.textContent = "X No válido";
            status.className = "status error";
            return; // Detenemos la ejecución aquí
        }
        
        // 1. Separar por saltos de línea o comas y limpiar espacios
        const ideas = data.result.split(/[\n,]+/).map(i => i.trim()).filter(i => i.length > 0);

        // 2. Crear contenedor principal de tarjetas
        const container = document.createElement("div");
        container.className = "ideas-container";
        responseDiv.appendChild(container);

        // 3. Iterar para crear cada tarjeta numerada
        for (let [index, idea] of ideas.entries()) {
            await sleep(1000);
            const card = document.createElement("div");
            // Rota entre color-1, color-2 y color-3
            card.className = `idea-card color-${(index % 3) + 1}`;

            // Elimina números seguidos de punto, guiones, asteriscos o viñetas al inicio
            const cleanIdea = idea.replace(/^[\s•·\d.*\-]+/, "").trim();

            if (cleanIdea) {
                card.innerHTML = `
                    <span class="number">${index + 1}</span>
                    <span class="text">${cleanIdea}</span>
                `;
                container.appendChild(card);
            }
        };

    } catch (err) {
        console.error("Error al generar:", err);
        status.textContent = "❌ Error";
        status.className = "status error";
        responseDiv.className = "response error";
        responseDiv.innerText = "No se pudieron generar las ideas. Intenta de nuevo.";
    } finally {
        // Restaurar estado del botón
        sendBtn.textContent = "✏ Generar Ideas";
        sendBtn.disabled = false;
        sendBtn.style.background = "linear-gradient(90deg,#5f6cff,#6f5eff)";
        sendBtn.style.color = "white";
        sendBtn.style.cursor = "pointer";
    }
}