// Cronômetro simples
let segundos = 0;
setInterval(() => {
    segundos++;
    const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
    const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
    const s = String(segundos % 60).padStart(2, "0");
    document.getElementById("cronometro").textContent = `⏱️ ${h}:${m}:${s}`;
}, 1000);

// Marcar item ativo na sidebar
const path = window.location.pathname.split("/").pop();
const links = document.querySelectorAll(".sidebar a");
links.forEach(link => {
    if (link.getAttribute("href") === path) {
        link.parentElement.classList.add("active");
    }
});

// Simular ação de criar novo template
document.getElementById("btnNovoTemplate").addEventListener("click", () => {
    alert("Função de criação de novo template em desenvolvimento 🚀");
});
