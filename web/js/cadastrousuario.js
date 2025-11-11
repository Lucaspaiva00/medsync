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

async function finalizarCadastro() {
    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const confSenha = document.getElementById("confSenha").value;
    const tipo = document.getElementById("tipoUsuario").value;
    const telefone = document.getElementById("telefone").value;
    const instituicao = document.getElementById("instituicao").value;
    const periodo = document.getElementById("periodo").value;
    const termos = document.getElementById("termos").checked;

    if (!nome || !email || !senha || !confSenha || !tipo) {
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

    // 🔹 Mapeia o campo correto de identificação
    let identificacao = "";
    if (tipo === "MEDICO") {
        identificacao = document.getElementById("crm").value || "";
    } else if (tipo === "ACADEMICO") {
        identificacao = document.getElementById("matricula").value || "";
    }

    // 🔹 Monta o objeto conforme o backend espera
    const novoUsuario = {
        nome,
        email,
        senha,
        tipo,
        telefone,
        identificacao,
        instituicao,
        periodo,
    };

    try {
        const response = await fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(novoUsuario),
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.error || "Erro ao cadastrar usuário.");
            return;
        }

        alert("Cadastro concluído! Agora envie seu documento para validação.");
        localStorage.setItem("usuarioCadastrado", JSON.stringify(data.usuario)); // guarda para upload
        window.location.href = "uploaddocumento.html";
    } catch (error) {
        console.error("Erro na requisição:", error);
        alert("Falha na comunicação com o servidor. Verifique a conexão.");
    }
}
