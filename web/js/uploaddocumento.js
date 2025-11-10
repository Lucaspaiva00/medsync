const tipo = localStorage.getItem("tipoUsuario") || "ACADEMICO";

const titulo = document.getElementById("tituloUpload");
const descricao = document.getElementById("descricaoUpload");
const areaUpload = document.getElementById("areaUpload");
const inputFile = document.getElementById("fileInput");
const preview = document.getElementById("previewArquivo");
const btnEnviar = document.getElementById("btnEnviar");

// Ajusta textos conforme médico / acadêmico
if (tipo === "MEDICO") {
    titulo.innerHTML = '<i class="fas fa-id-card"></i> Enviar documento profissional';
    descricao.textContent = "Envie uma cópia do seu CRM ou documento profissional para validação.";
} else {
    titulo.innerHTML = '<i class="fas fa-file-medical"></i> Enviar comprovante acadêmico';
    descricao.textContent = "Envie um comprovante de matrícula ou documento institucional.";
}

// Clique na área abre o input
areaUpload.addEventListener("click", () => inputFile.click());

// Mostra nome do arquivo
inputFile.addEventListener("change", () => {
    const file = inputFile.files[0];
    if (file) {
        preview.textContent = `Arquivo selecionado: ${file.name}`;
    } else {
        preview.textContent = "";
    }
});

// Envio (simulado)
btnEnviar.addEventListener("click", () => {
    if (!inputFile.files[0]) {
        alert("Selecione um arquivo antes de enviar.");
        return;
    }

    // Aqui você faria o upload de verdade pro backend
    // e marcaria statusVerificacao = PENDENTE_VERIFICACAO

    alert("Documento enviado com sucesso! Agora vamos analisar os dados.");
    window.location.href = "aguardando.html";
});
