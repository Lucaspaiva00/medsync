document.getElementById("btnNovoPaciente").addEventListener("click", () => {
  alert("Formulário de cadastro de novo paciente será integrado aqui.");
});

function novoRelatorio(pacienteNome) {
  localStorage.setItem("pacienteSelecionado", pacienteNome);
  window.location.href = "relatorios.html";
}
