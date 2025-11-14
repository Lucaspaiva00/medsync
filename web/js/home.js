document.addEventListener("DOMContentLoaded", () => {
    const cronometroEl = document.getElementById("cronometro");

    if (!cronometroEl) {
        console.error("Elemento #cronometro não encontrado!");
        return;
    }

    // Tempo inicial em segundos (30 minutos)
    const TEMPO_PADRAO = 30 * 60;

    // Carrega tempo salvo ou inicia com 30min
    let tempoRestante = parseInt(localStorage.getItem("timer_medsync")) || TEMPO_PADRAO;

    function formatarTempo(segundos) {
        const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
        const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
        const s = String(segundos % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function atualizarDisplay() {
        cronometroEl.textContent = "⏱️ " + formatarTempo(tempoRestante);
    }

    atualizarDisplay();

    // --- Timer principal ---
    const intervalo = setInterval(() => {
        tempoRestante--;
        localStorage.setItem("timer_medsync", tempoRestante);
        atualizarDisplay();

        if (tempoRestante <= 0) {
            clearInterval(intervalo);
            localStorage.removeItem("usuarioLogado");
            localStorage.removeItem("timer_medsync");
            alert("⏳ Seu tempo acabou! Faça login novamente.");
            window.location.href = "login.html";
        }
    }, 1000);

    // --- Editar tempo ao clicar ---
    cronometroEl.style.cursor = "pointer";
    cronometroEl.title = "Clique para ajustar o tempo";

    cronometroEl.addEventListener("click", () => {
        const novoTempo = prompt("Digite o novo tempo em minutos:", 30);
        if (!novoTempo || isNaN(novoTempo)) return;

        tempoRestante = Number(novoTempo) * 60;
        localStorage.setItem("timer_medsync", tempoRestante);
        atualizarDisplay();
    });

});
