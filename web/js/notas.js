// ===============================
// 🔐 VALIDAR SE O USUÁRIO ESTÁ LOGADO
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
const listaNotas = document.getElementById("listaNotas");
const tituloPagina = document.getElementById("tituloPagina");
const btnNovaNota = document.getElementById("btnNovaNota");
const inputBusca = document.getElementById("inputBusca");


// ===============================
// 🧭 MENU – CARREGAR CATEGORIAS
// ===============================
document.getElementById("btnTodas").addEventListener("click", () => carregarNotas("todas"));
document.getElementById("btnFavoritos").addEventListener("click", () => carregarNotas("favoritos"));
document.getElementById("btnRecentes").addEventListener("click", () => carregarNotas("recentes"));
document.getElementById("btnTemplates").addEventListener("click", () => carregarNotas("templates"));
document.getElementById("btnSelecionado").addEventListener("click", () => carregarNotas("selecionado"));
document.getElementById("btnMinhasNotas").addEventListener("click", () => carregarNotas("minhas"));


// ===============================
// 🔎 BUSCA
// ===============================
inputBusca.addEventListener("input", async () => {
    const q = inputBusca.value.trim();

    if (q === "") {
        carregarNotas("todas");
        return;
    }

    const res = await fetch(`${BASE}/buscar/${usuarioId}?q=${encodeURIComponent(q)}`);
    const data = await res.json();

    renderNotas(data, "Resultados da Busca");
});


// ===============================
// 📌 FUNÇÃO PRINCIPAL PARA CARREGAR NOTAS
// ===============================
async function carregarNotas(tipo = "todas") {
    let url = "";
    let titulo = "";

    switch (tipo) {
        case "todas":
            url = `${BASE}/${usuarioId}`;
            titulo = "Todas as Notas";
            break;

        case "favoritos":
            url = `${BASE}/favoritos/${usuarioId}`;
            titulo = "Favoritos";
            break;

        case "recentes":
            url = `${BASE}/recentes/${usuarioId}`;
            titulo = "Usados Recentemente";
            break;

        case "templates":
            url = `${BASE}/${usuarioId}`;
            titulo = "Templates Inteligentes";
            break;

        case "selecionado":
            url = `${BASE}/${usuarioId}`;
            titulo = "Selecionados";
            break;

        case "minhas":
            url = `${BASE}/${usuarioId}`;
            titulo = "Minhas Notas";
            break;

        default:
            url = `${BASE}/${usuarioId}`;
            titulo = "Notas";
    }

    const res = await fetch(url);
    let notas = await res.json();

    // FILTROS ESPECIAIS
    if (tipo === "templates") {
        notas = notas.filter(n => n.tipo === "TEMPLATE");
    }

    if (tipo === "selecionado") {
        notas = notas.filter(n => n.selecionado === true);
    }

    if (tipo === "minhas") {
        notas = notas.filter(n => n.pasta?.toUpperCase() === "GERAL");
    }

    renderNotas(notas, titulo);
}


// ===============================
// 🎨 RENDERIZAR LISTA DE NOTAS
// ===============================
function renderNotas(notas, titulo = "") {

    tituloPagina.innerText = titulo;

    listaNotas.innerHTML = "";

    if (!notas || notas.length === 0) {
        listaNotas.innerHTML = `<p class="text-muted">Nenhuma nota encontrada.</p>`;
        return;
    }

    notas.forEach(nota => {
        const item = document.createElement("div");
        item.classList.add("nota-item");

        item.innerHTML = `
            <div class="nota-header">
                <h4>${nota.titulo}</h4>
                <span class="data">${formatarData(nota.criadoEm)}</span>
            </div>

            <p class="preview">
                ${nota.conteudo.substring(0, 120)}...
            </p>

            <div class="nota-acoes">
                <button class="btn-acao" onclick="abrirNota(${nota.id})">📝</button>
                <button class="btn-acao" onclick="toggleFavorito(${nota.id})">
                    ${nota.favorito ? "⭐" : "☆"}
                </button>
                <button class="btn-acao" onclick="toggleSelecionado(${nota.id})">✔</button>
                <button class="btn-acao btn-delete" onclick="excluirNota(${nota.id})">🗑</button>
            </div>
        `;

        listaNotas.appendChild(item);
    });
}


// ===============================
// 📄 ABRIR NOTA
// ===============================
async function abrirNota(id) {
    const res = await fetch(`${BASE}/item/${id}`);
    const nota = await res.json();

    localStorage.setItem("notaSelecionada", JSON.stringify(nota));
    window.location.href = "nota-detalhe.html";
}



// ===============================
// ⭐ FAVORITAR / DESFAVORITAR
// ===============================
async function toggleFavorito(id) {
    await fetch(`${BASE}/favorito/${id}`, { method: "PATCH" });
    carregarNotas("todas");
}


// ===============================
// ✔ SELECIONAR / DESSELECIONAR
// ===============================
async function toggleSelecionado(id) {
    await fetch(`${BASE}/selecionado/${id}`, { method: "PATCH" });
    carregarNotas("selecionado");
}


// ===============================
// 🗑 EXCLUIR NOTA
// ===============================
async function excluirNota(id) {
    if (!confirm("Deseja realmente excluir esta nota?")) return;

    await fetch(`${BASE}/${id}`, { method: "DELETE" });
    carregarNotas("todas");
}


// ===============================
// ➕ Nova Nota
// ===============================
btnNovaNota.addEventListener("click", () => {
    localStorage.removeItem("notaSelecionada");
    window.location.href = "nota-detalhe.html";
});


// ===============================
// 🕒 FORMATAÇÃO DA DATA
// ===============================
function formatarData(dataISO) {
    const d = new Date(dataISO);
    return d.toLocaleDateString("pt-BR") + " " + d.toLocaleTimeString("pt-BR");
}


// ===============================
// 🚀 CARREGAR NOTAS AO ABRIR A PÁGINA
// ===============================
carregarNotas("todas");
