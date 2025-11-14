// ../js/notas.js

document.addEventListener("DOMContentLoaded", () => {
    // ===============================
    // LOGIN
    // ===============================
    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    if (!usuario) {
        alert("Sessão expirada. Faça login novamente.");
        location.href = "login.html";
        return;
    }

    const usuarioId = usuario.id;
    const BASE = "http://localhost:3000/api/notas";

    // ===============================
    // ELEMENTOS
    // ===============================
    const tituloPagina = document.getElementById("tituloPagina");

    const todasSecoes = document.querySelectorAll(".notas-section");
    const secNova = document.getElementById("novaNota");

    const containerNotas = document.getElementById("containerNotas");
    const containerGeral = document.getElementById("containerGeral");
    const containerSelecionado = document.getElementById("containerSelecionado");
    const containerFavoritos = document.getElementById("containerFavoritos");
    const containerRecentes = document.getElementById("containerRecentes");
    const containerMinhas = document.getElementById("containerMinhas");
    const containerGerenciar = document.getElementById("containerGerenciar");

    const tituloNova = document.getElementById("tituloNova");
    const tituloNovaNota = document.getElementById("tituloNovaNota");
    const contador = document.getElementById("contador");
    const inputBusca = document.getElementById("inputBusca");
    const resultadoBusca = document.getElementById("resultadoBusca");

    const btnSalvarNota = document.getElementById("btnSalvarNota");
    const btnNovaNotaRapida = document.getElementById("btnNovaNotaRapida");
    const btnExportarPDF = document.getElementById("btnExportarPDF");

    const menus = {
        todas: document.getElementById("menuTodas"),
        nova: document.getElementById("menuNova"),
        buscar: document.getElementById("menuBuscar"),
        templates: document.getElementById("menuTemplates"),
        geral: document.getElementById("menuGeral"),
        selecionado: document.getElementById("menuSelecionado"),
        favoritos: document.getElementById("menuFavoritos"),
        recentes: document.getElementById("menuRecentes"),
        minhas: document.getElementById("menuMinhas"),
        gerenciar: document.getElementById("menuGerenciar")
    };

    // ===============================
    // ESTADO
    // ===============================
    let notaEmEdicaoId = null;
    let filtroAtual = "todas";

    // ===============================
    // EDITOR QUILL
    // ===============================
    const editor = new Quill("#editor", {
        theme: "snow",
        placeholder: "Escreva sua nota aqui...",
        modules: { toolbar: "#toolbar" }
    });
    window.editor = editor;

    editor.on("text-change", () => {
        const texto = editor.getText().trim();
        const palavras = texto ? texto.split(/\s+/).filter(Boolean).length : 0;
        contador.textContent = `${palavras} palavras • ${texto.length} caracteres`;
    });

    // ===============================
    // UI HELPERS
    // ===============================
    function ativarMenu(nome) {
        Object.values(menus).forEach(el => el && el.classList.remove("active"));
        if (menus[nome]) menus[nome].classList.add("active");
    }

    function mostrarSecao(id) {
        todasSecoes.forEach(sec => sec.classList.remove("active"));
        const alvo = document.getElementById(id);
        if (alvo) alvo.classList.add("active");
    }

    function limparContainers() {
        [
            containerNotas,
            containerGeral,
            containerSelecionado,
            containerFavoritos,
            containerRecentes,
            containerMinhas,
            containerGerenciar
        ].forEach(c => c && (c.innerHTML = ""));
    }

    function containerPorTipo(tipo) {
        switch (tipo) {
            case "geral": return containerGeral;
            case "selecionado": return containerSelecionado;
            case "favoritos": return containerFavoritos;
            case "recentes": return containerRecentes;
            case "minhas": return containerMinhas;
            case "gerenciar": return containerGerenciar;
            default: return containerNotas;
        }
    }

    function secaoPorTipo(tipo) {
        switch (tipo) {
            case "geral": return "geral";
            case "selecionado": return "selecionado";
            case "favoritos": return "favoritos";
            case "recentes": return "recentes";
            case "minhas": return "minhas";
            case "gerenciar": return "gerenciar";
            default: return "listaNotas";
        }
    }

    function tituloPorTipo(tipo) {
        switch (tipo) {
            case "geral": return "Geral";
            case "selecionado": return "Selecionado";
            case "favoritos": return "Favoritos";
            case "recentes": return "Usados Recentemente";
            case "minhas": return "Minhas Notas";
            case "gerenciar": return "Gerenciar Notas";
            default: return "Todas as Notas";
        }
    }

    function stripHtml(html) {
        if (!html) return "";
        const tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    // ===============================
    // CARREGAR NOTAS
    // ===============================
    async function carregarNotas(tipo = "todas") {
        filtroAtual = tipo;

        let url = `${BASE}/${usuarioId}`;
        if (tipo !== "todas") url = `${BASE}/${tipo}/${usuarioId}`;

        try {
            const resp = await fetch(url);
            if (!resp.ok) throw new Error("Erro ao carregar notas");

            const notas = await resp.json();
            limparContainers();

            const container = containerPorTipo(tipo);
            renderNotas(notas, container);

            const secao = secaoPorTipo(tipo);
            mostrarSecao(secao);

            const titulo = tituloPorTipo(tipo);
            tituloPagina.textContent = titulo;
            const h2 = document.querySelector(`#${secao} h2`);
            if (h2) h2.textContent = (tipo === "todas" ? "📄 " : "📁 ") + titulo;
        } catch (e) {
            console.error(e);
            const container = containerPorTipo(tipo);
            container.innerHTML = `<p class="text-muted">Não foi possível carregar as notas.</p>`;
        }

        ativarMenu(tipo);
    }

    // ===============================
    // RENDER NOTAS
    // ===============================
    function renderNotas(lista, container) {
        if (!container) return;

        if (!lista || lista.length === 0) {
            container.innerHTML = `<p class="text-muted">Nenhuma nota encontrada.</p>`;
            return;
        }

        lista.forEach(nota => {
            const card = document.createElement("article");
            card.className = "nota-item";

            const textoLimpo = stripHtml(nota.conteudo).replace(/\s+/g, " ").trim();
            const preview = textoLimpo.length > 220
                ? textoLimpo.substring(0, 220) + "..."
                : textoLimpo || "Sem conteúdo pré-visualizável.";

            card.innerHTML = `
                <header class="nota-header">
                    <div class="nota-header-main">
                        <h4>${nota.titulo || "Nota sem título"}</h4>
                        <span class="nota-meta">${formatarData(nota.criadoEm)}</span>
                    </div>
                    <div class="nota-badges">
                        ${nota.pasta ? `<span class="badge">${nota.pasta}</span>` : ""}
                        ${nota.tipo ? `<span class="badge badge-outline">${nota.tipo}</span>` : ""}
                    </div>
                </header>

                <p class="preview">${preview}</p>

                <div class="nota-acoes">
                    <button class="btn-acao" data-acao="editar" data-id="${nota.id}">
                        <i class="fa-solid fa-pen-to-square"></i> Editar
                    </button>
                    <button class="btn-acao" data-acao="favorito" data-id="${nota.id}">
                        ${nota.favorito ? "⭐ Favorito" : "☆ Favoritar"}
                    </button>
                    <button class="btn-acao" data-acao="selecionar" data-id="${nota.id}">
                        <i class="fa-solid fa-check"></i> Selecionar
                    </button>
                    <button class="btn-acao btn-delete" data-acao="excluir" data-id="${nota.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            container.appendChild(card);
        });

        // Delegação de eventos para ações dos botões (mais leve)
        container.onclick = async (e) => {
            const btn = e.target.closest("button[data-acao]");
            if (!btn) return;

            const acao = btn.dataset.acao;
            const id = Number(btn.dataset.id);

            if (acao === "editar") abrirNota(id);
            if (acao === "favorito") toggleFavorito(id);
            if (acao === "selecionar") toggleSelecionado(id);
            if (acao === "excluir") excluirNota(id);
        };
    }

    // ===============================
    // ABRIR / EDITAR
    // ===============================
    async function abrirNota(id) {
        try {
            const resp = await fetch(`${BASE}/item/${id}`);
            if (!resp.ok) throw new Error("Erro ao carregar nota");
            const nota = await resp.json();

            notaEmEdicaoId = nota.id;
            tituloNova.textContent = "✏️ Editar Nota";
            tituloNovaNota.value = nota.titulo || "";
            editor.root.innerHTML = nota.conteudo || "";

            ativarMenu("nova");
            mostrarSecao("novaNota");
            tituloPagina.textContent = "Editar Nota";

            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (e) {
            console.error(e);
            alert("Não foi possível abrir a nota.");
        }
    }
    window.abrirNota = abrirNota; // se precisar via HTML

    // ===============================
    // SALVAR
    // ===============================
    async function salvarNota() {
        const titulo = (tituloNovaNota.value || "").trim() || "Nota sem título";
        const conteudo = editor.root.innerHTML.trim();

        if (!editor.getText().trim().length) {
            alert("Não é possível salvar uma nota vazia.");
            return;
        }

        const payload = {
            usuarioId,
            titulo,
            conteudo,
            pasta: "GERAL",
            tipo: "NORMAL"
        };

        const url = notaEmEdicaoId ? `${BASE}/${notaEmEdicaoId}` : BASE;
        const method = notaEmEdicaoId ? "PUT" : "POST";

        try {
            const resp = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            if (!resp.ok) throw new Error("Erro ao salvar nota");

            notaEmEdicaoId = null;
            tituloNova.textContent = "➕ Nova Nota";
            tituloNovaNota.value = "";
            editor.root.innerHTML = "";
            contador.textContent = "0 palavras • 0 caracteres";

            await carregarNotas("todas");
        } catch (e) {
            console.error(e);
            alert("Não foi possível salvar a nota.");
        }
    }

    btnSalvarNota.addEventListener("click", salvarNota);

    // CTRL+S
    document.addEventListener("keydown", (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
            e.preventDefault();
            if (secNova.classList.contains("active")) salvarNota();
        }
    });

    // ===============================
    // AÇÕES SIMPLES (favorito/selecionado/excluir)
    // ===============================
    async function toggleFavorito(id) {
        try {
            await fetch(`${BASE}/favorito/${id}`, { method: "PATCH" });
            carregarNotas(filtroAtual);
        } catch (e) {
            console.error(e);
        }
    }

    async function toggleSelecionado(id) {
        try {
            await fetch(`${BASE}/selecionado/${id}`, { method: "PATCH" });
            carregarNotas(filtroAtual);
        } catch (e) {
            console.error(e);
        }
    }

    async function excluirNota(id) {
        if (!confirm("Tem certeza que deseja excluir esta nota?")) return;
        try {
            await fetch(`${BASE}/${id}`, { method: "DELETE" });
            carregarNotas(filtroAtual);
        } catch (e) {
            console.error(e);
            alert("Não foi possível excluir a nota.");
        }
    }

    window.toggleFavorito = toggleFavorito;
    window.toggleSelecionado = toggleSelecionado;
    window.excluirNota = excluirNota;

    // ===============================
    // BUSCA
    // ===============================
    inputBusca?.addEventListener("input", async () => {
        const q = inputBusca.value.trim();

        if (!q) {
            resultadoBusca.innerHTML = `<p class="text-muted">Digite para buscar em suas notas.</p>`;
            return;
        }

        try {
            const resp = await fetch(`${BASE}/buscar/${usuarioId}?q=${encodeURIComponent(q)}`);
            if (!resp.ok) throw new Error("Erro ao buscar");
            const notas = await resp.json();

            resultadoBusca.innerHTML = "";
            renderNotas(notas, resultadoBusca);
        } catch (e) {
            console.error(e);
            resultadoBusca.innerHTML = `<p class="text-muted">Não foi possível realizar a busca.</p>`;
        }
    });

    // ===============================
    // EXPORTAR PDF
    // ===============================
    btnExportarPDF?.addEventListener("click", () => {
        const titulo = (tituloNovaNota.value || "Nota sem título").trim();
        const conteudoHTML = editor.root.innerHTML;

        const wrapper = document.createElement("div");
        wrapper.innerHTML = `
            <h1 style="font-size:22px; margin-bottom:12px;">${titulo}</h1>
            <p style="font-size:12px; color:#444; margin-bottom:20px;">
                Exportado em ${new Date().toLocaleString("pt-BR")}
            </p>
            <div style="font-size:14px; line-height:1.6;">${conteudoHTML}</div>
        `;

        const opt = {
            margin: 12,
            filename: `${titulo}.pdf`,
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf().set(opt).from(wrapper).save();
    });

    // ===============================
    // MENU / NAVEGAÇÃO
    // ===============================
    menus.todas.onclick = () => carregarNotas("todas");
    menus.nova.onclick = () => {
        ativarMenu("nova");
        mostrarSecao("novaNota");
        tituloPagina.textContent = "Nova Nota";
    };
    menus.buscar.onclick = () => {
        ativarMenu("buscar");
        mostrarSecao("buscarNota");
        tituloPagina.textContent = "Buscar Nota";
        inputBusca?.focus();
    };
    menus.templates.onclick = () => {
        ativarMenu("templates");
        mostrarSecao("templates");
        tituloPagina.textContent = "Templates Inteligentes";
    };
    menus.geral.onclick = () => carregarNotas("geral");
    menus.selecionado.onclick = () => carregarNotas("selecionado");
    menus.favoritos.onclick = () => carregarNotas("favoritos");
    menus.recentes.onclick = () => carregarNotas("recentes");
    menus.minhas.onclick = () => carregarNotas("minhas");
    menus.gerenciar.onclick = () => carregarNotas("gerenciar");

    btnNovaNotaRapida?.addEventListener("click", () => {
        menus.nova.click();
    });

    // ===============================
    // DATA
    // ===============================
    function formatarData(dataISO) {
        if (!dataISO) return "";
        const d = new Date(dataISO);
        if (Number.isNaN(d.getTime())) return "";
        return (
            d.toLocaleDateString("pt-BR") +
            " · " +
            d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        );
    }

    // ===============================
    // INÍCIO
    // ===============================
    carregarNotas("todas");
});
