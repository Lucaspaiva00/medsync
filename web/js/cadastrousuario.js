let etapaAtual = 1;

/* =====================
   TROCAR DE ETAPA
===================== */
function proximaEtapa(etapa) {
    document.getElementById(`step${etapaAtual}`).classList.add("hidden");
    document.getElementById(`step${etapa}`).classList.remove("hidden");
    etapaAtual = etapa;
    atualizarTitulo();
}

function voltarEtapa(etapa) {
    document.getElementById(`step${etapaAtual}`).classList.add("hidden");
    document.getElementById(`step${etapa}`).classList.remove("hidden");
    etapaAtual = etapa;
    atualizarTitulo();
}

function atualizarTitulo() {
    document.getElementById("etapaTitulo").innerText =
        etapaAtual === 1
            ? "Etapa 1 de 3 - Dados Pessoais"
            : etapaAtual === 2
            ? "Etapa 2 de 3 - Dados Profissionais"
            : "Etapa 3 de 3 - Segurança e Confirmação";
}

/* =====================
   CAMPOS DINÂMICOS
===================== */
document.getElementById("tipoUsuario").addEventListener("change", function () {
    const tipo = this.value;

    const areaMedico = document.getElementById("areaMedico");
    const areaAcademico = document.getElementById("areaAcademico");

    if (tipo === "MEDICO") {
        areaMedico.classList.remove("hidden");
        areaAcademico.classList.add("hidden");
    } else if (tipo === "ACADEMICO") {
        areaAcademico.classList.remove("hidden");
        areaMedico.classList.add("hidden");
    } else {
        areaMedico.classList.add("hidden");
        areaAcademico.classList.add("hidden");
    }
});

/* =====================
   FORÇA DA SENHA
===================== */
document.getElementById("senha").addEventListener("input", function () {
    const s = this.value;
    const indicador = document.getElementById("forcaSenha");

    let score = 0;
    if (s.length >= 8) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/[a-z]/.test(s)) score++;
    if (/[0-9]/.test(s)) score++;
    if (/[\W]/.test(s)) score++;

    if (score <= 2) {
        indicador.style.color = "red";
        indicador.innerText = "Senha fraca";
    } else if (score === 3) {
        indicador.style.color = "orange";
        indicador.innerText = "Senha média";
    } else {
        indicador.style.color = "green";
        indicador.innerText = "Senha forte";
    }
});

/* =====================
   FINALIZAR CADASTRO
===================== */
async function finalizarCadastro() {

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const tipo = document.getElementById("tipoUsuario").value;
    const instituicao = document.getElementById("instituicao").value;
    const senha = document.getElementById("senha").value;
    const confSenha = document.getElementById("confSenha").value;
    const termos = document.getElementById("termos").checked;

    let periodo = "";
    let identificacao = "";

    if (tipo === "ACADEMICO") {
        periodo = document.getElementById("periodo").value;
        identificacao = document.getElementById("matricula").value;
    }

    if (tipo === "MEDICO") {
        identificacao = document.getElementById("crm").value;
    }

    const arquivo = document.getElementById("arquivoDocumento").files[0];

    if (!nome || !email || !telefone || !tipo || !senha || !confSenha) {
        alert("Preencha todos os campos obrigatórios!");
        return;
    }

    if (senha !== confSenha) {
        alert("As senhas não coincidem!");
        return;
    }

    if (!termos) {
        alert("Você precisa aceitar os Termos de Uso.");
        return;
    }

    if (!arquivo) {
        alert("Envie o documento obrigatório.");
        return;
    }

    // Criar usuário
    const usuarioObj = {
        nome,
        email,
        telefone,
        tipo,
        instituicao,
        periodo,
        senha,
        identificacao
    };

    try {
        const usuarioResponse = await fetch("http://localhost:3000/api/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioObj)
        });

        const usuarioData = await usuarioResponse.json();

        if (!usuarioResponse.ok) {
            alert(usuarioData.error || "Erro ao cadastrar usuário.");
            return;
        }

        // Upload do documento
        const formData = new FormData();
        formData.append("usuarioId", usuarioData.usuario.id);
        formData.append("documento", arquivo);
        formData.append("tipo", tipo === "MEDICO" ? "CRM" : "MATRICULA");

        const docResponse = await fetch("http://localhost:3000/api/documentos", {
            method: "POST",
            body: formData
        });

        if (!docResponse.ok) {
            alert("Cadastro feito, mas houve erro ao enviar documento.");
        }

        localStorage.setItem("usuarioCadastrado", JSON.stringify(usuarioData.usuario));
        window.location.href = "aguardando.html";

    } catch (err) {
        console.error(err);
        alert("Falha na comunicação com o servidor.");
    }
}
