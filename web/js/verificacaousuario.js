document.getElementById("tabelaUsuarios").addEventListener("click", (event) => {
    if (event.target.classList.contains("approve")) {
        alert("Usuário aprovado (aqui você chamaria o backend).");
    }
    if (event.target.classList.contains("reject")) {
        alert("Usuário recusado (aqui você chamaria o backend).");
    }
});
