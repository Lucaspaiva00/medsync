const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
if (!usuario) {
    alert("Sessão expirada. Faça login novamente.");
    window.location.href = "login.html";
}

const usuarioId = usuario.id;
const BASE = "http://localhost:3000/api/notas";

let nota = JSON.parse(localStorage.getItem("notaSelecionada")) || null;
let notaId = nota?.id || null;

// ELEMENTOS
const tituloEl = document.getElementById("tituloNota");
const conteudoEl = document.getElementById("conteudoNota");
const pastaEl = document.getElementById("pastaNota");
const iconFav = document.getElementById("iconFavorito");
const iconSel = document.getElementById("iconSelecionado");


// =================================
// 📌 SE TIVER NOTA → CARREGA
// =================================
if (notaId) carregaNota();
else nota = { titulo: "", conteudo: "", favorito: false, selecionado: false };

async function carregaNota() {
    const res = await fetch(`${BASE}/item/${notaId}`);
    nota = await res.json();

    tituloEl.value = nota.titulo;
    conteudoEl.value = nota.conteudo;
    pastaEl.value = nota.pasta || "";

    iconFav.classList.toggle("fa-solid", nota.favorito);
    iconSel.classList.toggle("ativo", nota.selecionado);

    await fetch(`${BASE}/ultimo-uso/${notaId}`, { method: "PATCH" });
}


// =================================
// ⭐ FAVORITAR
// =================================
async function toggleFavorito() {
    const res = await fetch(`${BASE}/favorito/${notaId}`, { method: "PATCH" });
    nota.favorito = !nota.favorito;

    iconFav.classList.toggle("fa-solid");
}


// =================================
// ✔ SELECIONADO
// =================================
async function toggleSelecionado() {
    const res = await fetch(`${BASE}/selecionado/${notaId}`, { method: "PATCH" });
    nota.selecionado = !nota.selecionado;

    iconSel.classList.toggle("ativo");
}


// =================================
// 💾 SALVAR NOTA
// =================================
async function salvarNota() {
    const titulo = tituloEl.value.trim();
    const conteudo = conteudoEl.value.trim();
    const pasta = pastaEl.value;

    if (!titulo || !conteudo) {
        alert("Preencha o título e o conteúdo!");
        return;
    }

    const body = { titulo, conteudo, pasta, usuarioId };

    const metodo = notaId ? "PUT" : "POST";
    const url = notaId ? `${BASE}/${notaId}` : BASE;

    const res = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    const retorno = await res.json();

    if (!res.ok) {
        alert("Erro ao salvar nota!");
        return;
    }

    notaId = retorno.id;
    localStorage.removeItem("notaSelecionada");
    alert("Nota salva com sucesso!");
    window.location.href = "notas.html";
}


// =================================
// 🧠 AUTO SALVAR A CADA 3s
// =================================
setInterval(() => {
    if (!tituloEl.value.trim()) return;
    if (!conteudoEl.value.trim()) return;
    salvarNota();
}, 3000);
