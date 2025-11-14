// /js/home.js

document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // 1) VALIDAR LOGIN / USUÁRIO
    // =====================================
    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    if (!usuario) {
        alert("Sessão expirada. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    // Atualizar nome do usuário no canto direito
    const userNameEl = document.querySelector(".user-name");
    if (userNameEl) {
        userNameEl.textContent = usuario.nome || "Usuário";
    }

    const BASE = "http://localhost:3000/api/notas";

    // =====================================
    // 2) CRONÔMETRO
    // =====================================
    const cronometroEl = document.getElementById("cronometro");
    const TEMPO_PADRAO = 30 * 60; // 30 minutos

    let tempoRestante = parseInt(localStorage.getItem("timer_medsync")) || TEMPO_PADRAO;

    function formatarTempo(segundos) {
        const h = String(Math.floor(segundos / 3600)).padStart(2, "0");
        const m = String(Math.floor((segundos % 3600) / 60)).padStart(2, "0");
        const s = String(segundos % 60).padStart(2, "0");
        return `${h}:${m}:${s}`;
    }

    function atualizarDisplay() {
        if (cronometroEl) {
            cronometroEl.textContent = "⏱️ " + formatarTempo(tempoRestante);
        }
    }

    if (cronometroEl) {
        atualizarDisplay();

        const intervalo = setInterval(() => {
            tempoRestante--;
            localStorage.setItem("timer_medsync", tempoRestante);
            atualizarDisplay();

            if (tempoRestante <= 0) {
                clearInterval(intervalo);
                localStorage.removeItem("usuarioCadastrado");
                localStorage.removeItem("timer_medsync");
                alert("⏳ Seu tempo acabou! Faça login novamente.");
                window.location.href = "login.html";
            }
        }, 1000);

        cronometroEl.style.cursor = "pointer";
        cronometroEl.title = "Clique para ajustar o tempo";

        cronometroEl.addEventListener("click", () => {
            const novoTempo = prompt("Digite o novo tempo em minutos:", 30);
            if (!novoTempo || isNaN(novoTempo)) return;

            tempoRestante = Number(novoTempo) * 60;
            localStorage.setItem("timer_medsync", tempoRestante);
            atualizarDisplay();
        });
    }

    // =====================================
    // 3) BOTÃO "CRIAR NOVO DOCUMENTO"
    // =====================================
    const btnNovoTemplate = document.getElementById("btnNovoTemplate");
    if (btnNovoTemplate) {
        btnNovoTemplate.addEventListener("click", () => {
            // Vai para notas.html já abrindo a tela de nova nota
            window.location.href = "notas.html#nova";
        });
    }

    // =====================================
    // 4) LISTAR FAVORITAS E ÚLTIMAS NOTAS
    // =====================================
    const ulFavoritas = document.getElementById("favoritasNotas");
    const ulUltimas = document.getElementById("ultimasNotas");

    async function carregarBloco(tipo, ulElemento) {
        if (!ulElemento) return;

        try {
            ulElemento.innerHTML = `<li class="text-muted">Carregando...</li>`;

            const url =
                tipo === "favoritos"
                    ? `${BASE}/favoritos/${usuario.id}`
                    : `${BASE}/recentes/${usuario.id}`;

            const req = await fetch(url);
            if (!req.ok) throw new Error("Erro ao carregar notas");

            const notas = await req.json();
            ulElemento.innerHTML = "";

            if (!notas || notas.length === 0) {
                ulElemento.innerHTML = `<li class="text-muted">Nenhuma nota encontrada.</li>`;
                return;
            }

            // Limitar a 5
            notas.slice(0, 5).forEach(nota => {
                const li = document.createElement("li");
                const data = nota.criadoEm
                    ? new Date(nota.criadoEm).toLocaleDateString("pt-BR")
                    : "";

                li.innerHTML = `
                    <span>${nota.titulo || "Nota sem título"}</span>
                    <small>${data}</small>
                `;

                li.addEventListener("click", () => {
                    // Abre notas.html já com a nota selecionada
                    window.location.href = `notas.html#${nota.id}`;
                });

                ulElemento.appendChild(li);
            });
        } catch (err) {
            console.error(err);
            ulElemento.innerHTML = `<li class="text-muted">Erro ao carregar notas.</li>`;
        }
    }

    carregarBloco("favoritos", ulFavoritas);
    carregarBloco("recentes", ulUltimas);

    // =====================================
    // 5) BUSCA GLOBAL (ENTER → ir para NOTAS com filtro)
    // =====================================
    const mainSearch = document.getElementById("mainSearch");
    if (mainSearch) {
        mainSearch.addEventListener("keydown", e => {
            if (e.key === "Enter") {
                const q = mainSearch.value.trim();
                if (!q) return;

                // vai para notas.html com ?busca=...
                window.location.href = `notas.html?busca=${encodeURIComponent(q)}`;
            }
        });
    }
});
