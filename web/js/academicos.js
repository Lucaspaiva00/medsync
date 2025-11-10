// Aqui você vai receber do backend o status real do usuário
// Possíveis valores: "NAO_ENVIADO", "PENDENTE_VERIFICACAO", "VERIFICADO", "RECUSADO"
const statusUsuario = "PENDENTE_VERIFICACAO"; // <-- depois troca por dado real

const badge = document.getElementById("badgeStatus");
const msg = document.getElementById("mensagemStatus");
const areaAcoes = document.getElementById("areaAcoesStatus");

function montarTelaStatus() {
    areaAcoes.innerHTML = "";

    switch (statusUsuario) {
        case "NAO_ENVIADO":
            badge.textContent = "Documento não enviado";
            badge.className = "status-badge nao-enviado";
            msg.textContent = "Você ainda não enviou o comprovante de matrícula. Envie o documento para iniciarmos a validação.";
            criarBotao("Enviar documento", "blue", () => {
                window.location.href = "uploaddocumento.html";
            });
            break;

        case "PENDENTE_VERIFICACAO":
            badge.textContent = "Em análise";
            badge.className = "status-badge pendente";
            msg.textContent = "Seu documento foi recebido e está em análise pela nossa equipe.";
            criarBotao("Ver documento enviado", "gray", () => {
                window.location.href = "uploaddocumento.html";
            });
            break;

        case "VERIFICADO":
            badge.textContent = "Verificado";
            badge.className = "status-badge verificado";
            msg.textContent = "Sua comprovação acadêmica foi aprovada. Você tem acesso completo ao MedSync.";
            // não precisa de ação, mas podemos colocar um botão opcional
            break;

        case "RECUSADO":
            badge.textContent = "Recusado";
            badge.className = "status-badge recusado";
            msg.textContent = "Seu documento foi recusado. Verifique as orientações e envie novamente um comprovante válido.";
            criarBotao("Reenviar documento", "orange", () => {
                window.location.href = "uploaddocumento.html";
            });
            break;
    }
}

function criarBotao(texto, cor, onClick) {
    const btn = document.createElement("button");
    btn.className = `btn-small ${cor}`;
    btn.textContent = texto;
    btn.addEventListener("click", onClick);
    areaAcoes.appendChild(btn);
}

montarTelaStatus();
