// Mostrar paciente selecionado (vem da pacientes.html via localStorage)
const paciente = localStorage.getItem("pacienteSelecionado");
const pacienteSpan = document.getElementById("pacienteAtivo");

if (paciente) {
  pacienteSpan.textContent = `Paciente: ${paciente}`;
} else {
  pacienteSpan.textContent = "Paciente: não selecionado";
}

// Adicionar medicamento na tabela
const btnAddRemedio = document.getElementById("btnAddRemedio");
const listaRemedios = document.getElementById("listaRemedios");

btnAddRemedio.addEventListener("click", () => {
  const nome = document.getElementById("nomeMedicamento").value.trim();
  const dose = document.getElementById("doseMedicamento").value.trim();
  const horarios = document.getElementById("horarioMedicamento").value.trim();

  if (!nome) {
    alert("Informe pelo menos o nome do medicamento.");
    return;
  }

  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${nome}</td>
    <td>${dose || "-"}</td>
    <td>${horarios || "-"}</td>
    <td>
      <button class="btn-small gray btn-remover">
        <i class="fas fa-trash"></i> Remover
      </button>
    </td>
  `;

  listaRemedios.appendChild(tr);

  // limpar campos
  document.getElementById("nomeMedicamento").value = "";
  document.getElementById("doseMedicamento").value = "";
  document.getElementById("horarioMedicamento").value = "";
});

// Delegação para remover linha de medicamento
listaRemedios.addEventListener("click", (e) => {
  if (e.target.closest(".btn-remover")) {
    const linha = e.target.closest("tr");
    linha.remove();
  }
});

// "Salvar" relatório (MVP – depois você integra com o backend)
document.getElementById("btnSalvarRelatorio").addEventListener("click", () => {
  const texto = document.getElementById("textoRelatorio").value.trim();

  if (!texto) {
    alert("O laudo está vazio. Escreva algo antes de salvar.");
    return;
  }

  // Aqui você vai montar o objeto para enviar ao backend depois (fetch/axios)
  alert("Relatório salvo (simulação). Depois integramos com o backend 🚀");
});
