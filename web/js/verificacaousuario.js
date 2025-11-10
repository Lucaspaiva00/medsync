// Lista simulada de usuários (futuramente vem da API)
let usuarios = [
  { id: 1, nome: "Lucas Silva", tipo: "Acadêmico", identificacao: "Matrícula 20231234", status: "PENDENTE" },
  { id: 2, nome: "Mariana Alves", tipo: "Médico", identificacao: "CRM 15894-SP", status: "PENDENTE" },
  { id: 3, nome: "João Pereira", tipo: "Acadêmico", identificacao: "Matrícula 20231888", status: "PENDENTE" },
  { id: 4, nome: "Paula Mendes", tipo: "Médico", identificacao: "CRM 16821-SP", status: "PENDENTE" }
];

// Função para gerar o badge de status
function getStatusBadge(status) {
  const statusClass = {
    "PENDENTE": "pending",
    "VERIFICADO": "verified",
    "RECUSADO": "rejected"
  }[status] || "pending";

  return `<span class="status ${statusClass}">${status}</span>`;
}

// Renderização da tabela
function renderTable() {
  const tbody = document.getElementById("tabelaUsuarios");
  const search = document.getElementById("searchInput").value.toLowerCase();
  const tipoFiltro = document.getElementById("filterTipo").value;

  tbody.innerHTML = "";

  const filtrados = usuarios.filter(u => {
    const matchNome = u.nome.toLowerCase().includes(search);
    const matchTipo = tipoFiltro === "Todos" || u.tipo === tipoFiltro;
    return matchNome && matchTipo;
  });

  filtrados.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.nome}</td>
      <td>${user.tipo}</td>
      <td>${user.identificacao}</td>
      <td>${getStatusBadge(user.status)}</td>
      <td>
        ${user.status === "PENDENTE" ? `
          <button class="btn-approve" onclick="aprovarUsuario(${user.id})">
            <i class="fas fa-check"></i> Aprovar
          </button>
          <button class="btn-reject" onclick="recusarUsuario(${user.id})">
            <i class="fas fa-times"></i> Recusar
          </button>
        ` : "<em>Nenhuma ação</em>"}
      </td>
    `;
    tbody.appendChild(row);
  });

  if (filtrados.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#666;">Nenhum resultado encontrado</td></tr>`;
  }
}

// Ações do admin
function aprovarUsuario(id) {
  const user = usuarios.find(u => u.id === id);
  if (!user) return;

  user.status = "VERIFICADO";
  alert(`✅ ${user.nome} foi aprovado com sucesso!`);
  renderTable();
}

function recusarUsuario(id) {
  const user = usuarios.find(u => u.id === id);
  if (!user) return;

  user.status = "RECUSADO";
  alert(`❌ ${user.nome} foi recusado.`);
  renderTable();
}

// Eventos
document.getElementById("searchInput").addEventListener("input", renderTable);
document.getElementById("filterTipo").addEventListener("change", renderTable);

// Inicializa
document.addEventListener("DOMContentLoaded", renderTable);
