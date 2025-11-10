function verificarStatus() {
    const status = localStorage.getItem("statusVerificacao");

    if (status === "VERIFICADO") {
        alert("Sua conta foi aprovada! Redirecionando...");
        window.location.href = "login.html";
    } else {
        alert("Ainda em análise. Tente novamente mais tarde.");
    }
}
