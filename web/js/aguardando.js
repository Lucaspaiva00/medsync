const tipo = localStorage.getItem("tipoUsuario") || "ACADEMICO";
const msg = document.getElementById("mensagem");

if (tipo === "MEDICO") {
    msg.textContent = "Seu documento profissional está sendo analisado pela equipe MedSync. Você receberá um e-mail assim que for aprovado.";
} else {
    msg.textContent = "Seu comprovante acadêmico está em análise. Você será notificado por e-mail quando a validação for concluída.";
}
