// ===============================
// 🔐 VALIDAR LOGIN
// ===============================
const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

if (!usuario) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
}

const usuarioId = usuario.id;
const BASE = "http://localhost:3000/api/notas";

// ===============================
// ELEMENTOS DO DOM
// ===============================
const secLista = document.getElementById("listaNotas");
const secNova = document.getElementById("novaNota");
const secBuscar = document.getElementById("buscarNota");
const secGerenciar = document.getElementById("gerenciar");

const tituloLista = document.getElementById("tituloLista");
const containerNotas = document.getElementById("containerNotas");

const tituloNova = document.getElementById("tituloNova");
const tituloNovaNota = document.getElementById("tituloNovaNota");
const btnSalvarNota = document.getElementById("btnSalvarNota");

const inputBusca = document.getElementById("inputBusca");
const resultadoBusca = document.getElementById("resultadoBusca");

// menus
const menuTodas = document.getElementById("menuTodas");
const menuNova = document.getElementById("menuNova");
const menuBuscar = document.getElementById("menuBuscar");
const menuTemplates = document.getElementById("menuTemplates");
const menuGeral = document.getElementById("menuGeral");
const menuSelecionado = document.getElementById("menuSelecionado");
const menuFavoritos = document.getElementById("menuFavoritos");
const menuRecentes = document.getElementById("menuRecentes");
const menuMinhas = document.getElementById("menuMinhas");
const menuGerenciar = document.getElementById("menuGerenciar");

const todosMenus = document.querySelectorAll(".sidebar-notas li");
const todasSecoes = document.querySelectorAll(".notas-section");

// controle de estado
let filtroAtual = "todas";
let notaEmEdicaoId = null;

// ===============================
// FUNÇÕES DE UI
// ===============================
function ativarMenu(menu) {
    todosMenus.forEach(li => li.classList.remove("active"));
    menu.classList.add("active");
}

function mostrarSecao(idSecao) {
    todasSecoes.forEach(sec => sec.classList.remove("active"));
    document.getElementById(idSecao).classList.add("active");
}

// ===============================
// CARREGAR NOTAS (LISTA PRINCIPAL)
// ===============================
async function carregarNotas(tipo = "todas") {
    filtroAtual = tipo;

    let url = "";
    let titulo = "";

    switch (tipo) {
        case "todas":
            url = `${BASE}/${usuarioId}`;
            titulo = "📄 Todas as Notas";
            break;

        case "favoritos":
            url = `${BASE}/favoritos/${usuarioId}`;
            titulo = "⭐ Favoritos";
            break;

        case "recentes":
            url = `${BASE}/recentes/${usuarioId}`;
            titulo = "🕓 Usados Recentemente";
            break;

        case "templates":
            url = `${BASE}/templates/${usuarioId}`;
            titulo = "✨ Templates Inteligentes";
            break;

        case "selecionado":
            url = `${BASE}/selecionado/${usuarioId}`;
            titulo = "✔ Selecionado";
            break;

        case "geral":
        case "minhas":
            // pega tudo e filtra por pasta GERAL
            url = `${BASE}/${usuarioId}`;
            titulo = tipo === "geral" ? "📁 Geral" : "📂 Minhas Notas";
            break;

        case "gerenciar":
            url = `${BASE}/${usuarioId}`;
            titulo = "⚙ Gerenciar Notas";
            break;

        default:
            url = `${BASE}/${usuarioId}`;
            titulo = "📄 Notas";
            break;
    }

    try {
        const res = await fetch(url);
        let notas = await res.json();

        if (tipo === "geral" || tipo === "minhas") {
            notas = notas.filter(n => (n.pasta || "GERAL").toUpperCase() === "GERAL");
        }

        tituloLista.textContent = titulo;
        mostrarSecao("listaNotas");
        renderNotas(notas);
    } catch (err) {
        console.error(err);
        containerNotas.innerHTML = `<p class="text-muted">Erro ao carregar notas.</p>`;
    }
}

// ===============================
// RENDERIZAR LISTA
// ===============================
function renderNotas(notas) {
    containerNotas.innerHTML = "";

    if (!notas || notas.length === 0) {
        containerNotas.innerHTML = `<p class="text-muted">Nenhuma nota encontrada.</p>`;
        return;
    }

    notas.forEach(nota => {
        const div = document.createElement("div");
        div.classList.add("nota-item");

        div.innerHTML = `
            <div class="nota-header">
                <h4>${nota.titulo}</h4>
                <span class="data">${formatarData(nota.criadoEm)}</span>
            </div>
            <p class="preview">
                ${nota.conteudo ? nota.conteudo.substring(0, 180) : ""}...
            </p>
            <div class="nota-acoes">
                <button class="btn-acao" onclick="abrirNota(${nota.id})" title="Editar">📝</button>
                <button class="btn-acao" onclick="toggleFavorito(${nota.id})" title="Favorito">
                    ${nota.favorito ? "⭐" : "☆"}
                </button>
                <button class="btn-acao" onclick="toggleSelecionado(${nota.id})" title="Selecionar">✔</button>
                <button class="btn-acao btn-delete" onclick="excluirNota(${nota.id})" title="Excluir">🗑</button>
            </div>
        `;

        containerNotas.appendChild(div);
    });
}

// ===============================
// ABRIR / EDITAR NOTA NA MESMA PÁGINA
// ===============================
window.abrirNota = async function (id) {
    try {
        const res = await fetch(`${BASE}/item/${id}`);
        const nota = await res.json();

        notaEmEdicaoId = nota.id;
        tituloNova.textContent = "✏️ Editar Nota";
        tituloNovaNota.value = nota.titulo;
        conteudoNovaNota.value = nota.conteudo || "";

        ativarMenu(menuNova);
        mostrarSecao("novaNota");
    } catch (err) {
        console.error(err);
        alert("Erro ao abrir nota.");
    }
};

// ===============================
// SALVAR (CRIAR OU EDITAR)
// ===============================
async function salvarNota() {
    const titulo = (tituloNovaNota.value || "").trim() || "Nota sem título";

    // AGORA BUSCA O CONTEÚDO CORRETO DO EDITOR QUILL
    const conteudo = editor.root.innerHTML.trim();
    const conteudoTexto = editor.getText().trim();

    if (!conteudoTexto) {
        alert("Digite o conteúdo da nota.");
        return;
    }

    try {
        if (!notaEmEdicaoId) {
            // criar nova nota
            await fetch(BASE, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    usuarioId,
                    titulo,
                    conteudo,
                    pasta: "GERAL",
                    tipo: "NORMAL"
                })
            });
        } else {
            // atualizar nota existente
            await fetch(`${BASE}/${notaEmEdicaoId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    titulo,
                    conteudo,
                    pasta: "GERAL"
                })
            });
        }

        // reset do editor
        notaEmEdicaoId = null;
        tituloNova.textContent = "➕ Nova Nota";
        tituloNovaNota.value = "";
        editor.root.innerHTML = "";

        ativarMenu(menuTodas);
        await carregarNotas("todas");

    } catch (err) {
        console.error(err);
        alert("Erro ao salvar nota.");
    }
}


btnSalvarNota.addEventListener("click", salvarNota);

// ===============================
// FAVORITO / SELECIONADO / EXCLUIR
// ===============================
window.toggleFavorito = async function (id) {
    await fetch(`${BASE}/favorito/${id}`, { method: "PATCH" });
    carregarNotas(filtroAtual);
};

window.toggleSelecionado = async function (id) {
    await fetch(`${BASE}/selecionado/${id}`, { method: "PATCH" });
    carregarNotas(filtroAtual);
};

window.excluirNota = async function (id) {
    if (!confirm("Deseja realmente excluir esta nota?")) return;
    await fetch(`${BASE}/${id}`, { method: "DELETE" });
    carregarNotas(filtroAtual);
};

// ===============================
// BUSCA (SEÇÃO ENCONTRAR NOTA)
// ===============================
inputBusca.addEventListener("input", async () => {
    const q = inputBusca.value.trim();

    if (q === "") {
        resultadoBusca.innerHTML = `<p class="text-muted">Digite para buscar.</p>`;
        return;
    }

    try {
        const res = await fetch(`${BASE}/buscar/${usuarioId}?q=${encodeURIComponent(q)}`);
        const notas = await res.json();

        resultadoBusca.innerHTML = "";

        if (!notas || notas.length === 0) {
            resultadoBusca.innerHTML = `<p class="text-muted">Nenhuma nota encontrada para "${q}".</p>`;
            return;
        }

        notas.forEach(nota => {
            const div = document.createElement("div");
            div.classList.add("nota-item");

            div.innerHTML = `
                <div class="nota-header">
                    <h4>${nota.titulo}</h4>
                    <span class="data">${formatarData(nota.criadoEm)}</span>
                </div>
                <p class="preview">
                    ${nota.conteudo ? nota.conteudo.substring(0, 150) : ""}...
                </p>
                <div class="nota-acoes">
                    <button class="btn-acao" onclick="abrirNota(${nota.id})">📝 Abrir</button>
                </div>
            `;

            resultadoBusca.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        resultadoBusca.innerHTML = `<p class="text-muted">Erro na busca.</p>`;
    }
});

// ===============================
// MENU – EVENTOS
// ===============================
menuTodas.addEventListener("click", () => {
    ativarMenu(menuTodas);
    carregarNotas("todas");
});

menuNova.addEventListener("click", () => {
    ativarMenu(menuNova);
    notaEmEdicaoId = null;
    tituloNova.textContent = "➕ Nova Nota";
    tituloNovaNota.value = "";
    conteudoNovaNota.value = "";
    mostrarSecao("novaNota");
});

menuBuscar.addEventListener("click", () => {
    ativarMenu(menuBuscar);
    mostrarSecao("buscarNota");
    inputBusca.focus();
});

menuTemplates.addEventListener("click", () => {
    ativarMenu(menuTemplates);
    carregarNotas("templates");
});

menuGeral.addEventListener("click", () => {
    ativarMenu(menuGeral);
    carregarNotas("geral");
});

menuSelecionado.addEventListener("click", () => {
    ativarMenu(menuSelecionado);
    carregarNotas("selecionado");
});

menuFavoritos.addEventListener("click", () => {
    ativarMenu(menuFavoritos);
    carregarNotas("favoritos");
});

menuRecentes.addEventListener("click", () => {
    ativarMenu(menuRecentes);
    carregarNotas("recentes");
});

menuMinhas.addEventListener("click", () => {
    ativarMenu(menuMinhas);
    carregarNotas("minhas");
});

menuGerenciar.addEventListener("click", () => {
    ativarMenu(menuGerenciar);
    carregarNotas("gerenciar");
});

// ===============================
// UTIL: FORMATAR DATA
// ===============================
function formatarData(dataISO) {
    const d = new Date(dataISO);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

// ===============================
// INICIAL
// ===============================
carregarNotas("todas");
