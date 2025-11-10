function selecionarPerfil(tipo) {
    localStorage.setItem("tipoUsuario", tipo);
    window.location.href = "uploaddocumento.html";
}
