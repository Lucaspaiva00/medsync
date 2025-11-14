document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));

    if (!usuario) {
        alert("Sessão expirada.");
        window.location.href = "login.html";
        return;
    }

    if (usuario.tipo === "MEDICO") {
        document.getElementById("campoMatricula").style.display = "none";
    } else {
        document.getElementById("campoCRM").style.display = "none";
    }
});

async function enviarDocumento() {

    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    const arquivo = document.getElementById("arquivo").files[0];

    if (!arquivo) {
        alert("Selecione um documento.");
        return;
    }

    const upload = new FormData();
    upload.append("usuarioId", usuario.id);
    upload.append("tipo", usuario.tipo === "MEDICO" ? "CRM" : "MATRICULA");
    upload.append("documento", arquivo);

    const response = await fetch("http://localhost:3000/api/documentos", {
        method: "POST",
        body: upload
    });

    if (!response.ok) {
        alert("Erro ao enviar documento.");
        return;
    }

    window.location.href = "aguardando.html";
}
