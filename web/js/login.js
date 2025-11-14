window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");

    if (!form) {
        console.error("❌ Formulário de login não encontrado no DOM.");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            alert("Preencha todos os campos para continuar.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();
            console.log("🟢 Retorno do login:", data);

            if (!response.ok) {
                alert(data.error || "Erro ao fazer login.");
                return;
            }

            // 🔹 Salva o usuário no localStorage com o nome correto
            localStorage.setItem("usuarioLogado", JSON.stringify(data.usuario));

            // 🔹 Salva token (opcional)
            if (data.token)
                localStorage.setItem("token", data.token);

            alert("Login realizado com sucesso!");
            window.location.href = "home.html";

        } catch (error) {
            console.error("🔥 Erro de conexão:", error);
            alert("Erro na comunicação com o servidor.");
        }
    });
});
