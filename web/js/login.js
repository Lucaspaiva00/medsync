document.getElementById("btnLogin").addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();

    // Aqui depois você troca por chamada pro backend
    if (!email) {
        alert("Preencha o e-mail.");
        return;
    }

    // Simulação: se for admin, vai para verificação
    if (email.includes("admin")) {
        window.location.href = "verificacaousuario.html";
    } else {
        window.location.href = "onboarding.html";
    }
});
