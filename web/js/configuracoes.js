// Simulação — no seu sistema isso virá do localStorage ou do backend
const usuarioLogado = {
    tipo: "academico", // ou "medico"
    nome: "Lucas Paiva",
    email: "lucas@paivatech.com",
    tema: "light"
};

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("nomeUsuario").value = usuarioLogado.nome;
    document.getElementById("emailUsuario").value = usuarioLogado.email;
    document.getElementById("temaUsuario").value = usuarioLogado.tema;

    const configArea = document.getElementById("configEspecifica");

    if (usuarioLogado.tipo === "medico") {
        configArea.innerHTML = `
      <h3>🏥 Informações Médicas</h3>
      <div class="form-group">
        <label>CRM</label>
        <input type="text" id="crm" placeholder="Ex: 123456-SP">
      </div>
      <div class="form-group">
        <label>Especialidade</label>
        <input type="text" id="especialidade" placeholder="Ex: Cardiologia">
      </div>
      <div class="form-group">
        <label>Hospital/Clínica</label>
        <input type="text" id="hospital" placeholder="Ex: Hospital São Lucas">
      </div>
    `;
    } else {
        configArea.innerHTML = `
      <h3>🎓 Informações Acadêmicas</h3>
      <div class="form-group">
        <label>Instituição</label>
        <input type="text" id="instituicao" placeholder="Ex: USP, Unicamp...">
      </div>
      <div class="form-group">
        <label>Matrícula</label>
        <input type="text" id="matricula" placeholder="Número de matrícula">
      </div>
      <div class="form-group">
        <label>Período</label>
        <input type="text" id="periodo" placeholder="Ex: 7º período">
      </div>
    `;
    }
});

function salvarConfiguracoes() {
    alert("Alterações salvas com sucesso!");
    // Aqui você pode enviar os dados via fetch() para o backend
}
