let etapaAtual = 1;

function proximaEtapa(etapa) {
    document.getElementById(`step${etapaAtual}`).classList.add("hidden");
    document.getElementById(`step${etapa}`).classList.remove("hidden");
    etapaAtual = etapa;
    document.getElementById("etapaTitulo").innerText =
        etapa === 2
            ? "Etapa 2 de 3 - Dados Profissionais"
            : etapa === 3
                ? "Etapa 3 de 3 - Segurança e Confirmação"
                : "";
}

function finalizarCadastro() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confSenha = document.getElementById("confSenha").value;
    const termos = document.getElementById("termos").checked;

    if (!nome || !email || !senha || !confSenha) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    if (senha !== confSenha) {
        alert("As senhas não conferem!");
        return;
    }

    if (!termos) {
        alert("Você precisa aceitar os Termos de Uso para continuar.");
        return;
    }

    // Simulação de envio ao backend
    const novoUsuario = {
        nome,
        cpf: document.getElementById("cpf").value,
        nascimento: document.getElementById("nascimento").value,
        telefone: document.getElementById("telefone").value,
        email,
        endereco: document.getElementById("endereco").value,
        tipo: document.getElementById("tipoUsuario").value,
        instituicao: document.getElementById("instituicao").value,
        periodo: document.getElementById("periodo").value,
        matricula: document.getElementById("matricula").value,
        especialidade: document.getElementById("especialidade").value,
        crm: document.getElementById("crm").value,
        estado: document.getElementById("estado").value,
    };

    console.log("Usuário cadastrado:", novoUsuario);

    // Redireciona para upload
    alert("Cadastro concluído! Agora envie seu documento para validação.");
    window.location.href = "uploaddocumento.html";
}
