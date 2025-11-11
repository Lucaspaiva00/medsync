window.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    const infoEl = document.getElementById("usuarioInfo");
    const form = document.getElementById("uploadForm");
    const statusMsg = document.getElementById("statusMensagem");

    // 🔹 Se o usuário não existir, volta pro cadastro
    if (!usuario) {
        alert("Usuário não encontrado. Faça o cadastro novamente.");
        window.location.href = "cadastrousuario.html";
        return;
    }

    // 🔹 Exibe as informações do usuário logado
    infoEl.innerHTML = `
    <strong>Usuário:</strong> ${usuario.nome} <br>
    <strong>Perfil:</strong> ${usuario.tipo === "MEDICO" ? "Médico" : "Acadêmico"}
  `;

    // 🔹 Envio do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const tipo = document.getElementById("tipoDocumento").value;
        const file = document.getElementById("arquivo").files[0];

        if (!file || !tipo) {
            alert("Selecione o tipo de documento e o arquivo antes de enviar.");
            return;
        }

        const formData = new FormData();
        formData.append("usuarioId", usuario.id);
        formData.append("tipo", tipo);
        formData.append("documento", file);

        try {
            const response = await fetch("http://localhost:3000/api/documentos", {
                method: "POST",
                body: formData,
            });

            // 🔹 Verifica resposta do backend
            if (!response.ok) {
                const data = await response.json();
                statusMsg.textContent = data.error || "Erro ao enviar documento.";
                statusMsg.className = "status-msg erro";
                return;
            }

            const data = await response.json();
            console.log("📄 Retorno upload:", response.status, data);

            // 🔹 Mensagem de sucesso
            statusMsg.textContent = "✅ Documento enviado com sucesso! Aguarde aprovação.";
            statusMsg.className = "status-msg sucesso";

            // 🔹 Atualiza status local antes do redirecionamento
            usuario.status = "EM_ANALISE";
            localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));

            // 🔹 Espera 2 segundos e redireciona com segurança
            setTimeout(() => {
                console.log("➡️ Redirecionando para aguardando.html...");
                window.location.assign("aguardando.html");
            }, 2000);

        } catch (error) {
            console.error("🔥 Erro no upload:", error);
            statusMsg.textContent = "Erro na comunicação com o servidor.";
            statusMsg.className = "status-msg erro";
        }
    });
});
