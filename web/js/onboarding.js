document.querySelectorAll(".role-option").forEach(card => {
    card.addEventListener("click", () => {
        const tipo = card.getAttribute("data-role");
        // Guarda o tipo para as próximas telas
        localStorage.setItem("tipoUsuario", tipo);
        window.location.href = "uploaddocumento.html";
    });
});
