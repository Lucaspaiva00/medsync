document.addEventListener("DOMContentLoaded", () => {
    const tipo = localStorage.getItem("tipoUsuario");
    const tipoTexto = document.getElementById("tipoTexto");

    tipoTexto.innerText = tipo === "MEDICO"
        ? "Envie uma cópia digital do seu CRM para validação."
        : "Envie seu comprovante de matrícula atualizado.";

    const input = document.getElementById("documento");
    const label = document.querySelector(".upload-label");
    const arquivo = document.getElementById("arquivoSelecionado");

    label.addEventListener("click", () => input.click());

    input.addEventListener("change", () => {
        arquivo.innerText = input.files.length ? input.files[0].name : "";
    });

    document.getElementById("uploadForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (!input.files.length) {
            alert("Selecione um arquivo antes de enviar.");
            return;
        }

        localStorage.setItem("statusVerificacao", "PENDENTE");
        alert("Documento enviado com sucesso! Aguarde a verificação.");
        window.location.href = "aguardando.html";
    });
});
