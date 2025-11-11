window.addEventListener("DOMContentLoaded", async () => {
    const usuario = JSON.parse(localStorage.getItem("usuarioCadastrado"));
    const infoEl = document.getElementById("usuarioInfo");
    const statusEl = document.getElementById("statusMensagem");

    if (!usuario) {
        alert("Usuário não encontrado. Faça login novamente.");
        window.location.href = "login.html";
        return;
    }

    infoEl.innerHTML = `
    <strong>Usuário:</strong> ${usuario.nome}<br>
    <strong>Perfil:</strong> ${usuario.tipo === "MEDICO" ? "Médico" : "Acadêmico"}
  `;

    async function verificarStatus() {
        try {
            const response = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}`);
            const data = await response.json();

            if (!response.ok) {
                statusEl.textContent = "Erro ao consultar status.";
                statusEl.classList.add("erro");
                return;
            }

            usuario.status = data.status;
            localStorage.setItem("usuarioCadastrado", JSON.stringify(usuario));

            if (data.status === "EM_ANALISE" || data.status === "PENDENTE") {
                statusEl.textContent = "⏳ Seu documento está em análise. Aguarde a aprovação.";
            } else if (data.status === "RECUSADO") {
                statusEl.textContent = "❌ Seu cadastro foi recusado. Envie um novo documento.";
                statusEl.classList.add("erro");
            } else if (data.status === "VERIFICADO") {
                statusEl.textContent = "✅ Cadastro aprovado! Redirecionando...";
                statusEl.classList.add("sucesso");
                setTimeout(() => {
                    window.location.href = "home.html";
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            statusEl.textContent = "Erro ao conectar com o servidor.";
            statusEl.classList.add("erro");
        }
    }

    // Verifica imediatamente e a cada 10 segundos
    await verificarStatus();
    setInterval(verificarStatus, 10000);
});
