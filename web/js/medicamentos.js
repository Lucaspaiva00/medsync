const btnNovoMed = document.getElementById("btnNovoMed");
const modal = document.getElementById("modalNovoMed");
const fecharModal = document.getElementById("fecharModal");
const salvarMed = document.getElementById("salvarMed");
const lista = document.getElementById("listaMedicamentos");
const busca = document.getElementById("buscaMedicamento");

btnNovoMed.addEventListener("click", () => modal.classList.remove("hidden"));
fecharModal.addEventListener("click", () => modal.classList.add("hidden"));

salvarMed.addEventListener("click", () => {
    const nome = document.getElementById("nomeMed").value.trim();
    const desc = document.getElementById("descMed").value.trim();
    const dose = document.getElementById("doseMed").value.trim();

    if (!nome || !desc || !dose) {
        alert("Preencha todos os campos!");
        return;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
    <td>${nome}</td>
    <td>${desc}</td>
    <td>${dose}</td>
    <td>
      <button class="btn-small gray btn-edit"><i class="fas fa-pen"></i> Editar</button>
      <button class="btn-small red btn-delete"><i class="fas fa-trash"></i> Excluir</button>
    </td>
  `;
    lista.appendChild(tr);

    // Limpar e fechar modal
    document.getElementById("nomeMed").value = "";
    document.getElementById("descMed").value = "";
    document.getElementById("doseMed").value = "";
    modal.classList.add("hidden");
});

// Buscar medicamentos
busca.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    document.querySelectorAll("#listaMedicamentos tr").forEach(tr => {
        tr.style.display = tr.textContent.toLowerCase().includes(termo) ? "" : "none";
    });
});

// Excluir medicamento
lista.addEventListener("click", (e) => {
    if (e.target.closest(".btn-delete")) {
        if (confirm("Deseja excluir este medicamento?")) {
            e.target.closest("tr").remove();
        }
    }
});
