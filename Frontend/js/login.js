function fazerLogin() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    if (!email || !senha) {
        mensagem.textContent = "Preencha todos os campos!";
        mensagem.style.color = "red";
        return;
    }

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.sucesso) {
            mensagem.textContent = "Login realizado com sucesso! ✅";
            mensagem.style.color = "green";

            localStorage.setItem("logado", "true");

            // ir para tela principal
            window.location.href = "app.html";
        } else {
            mensagem.textContent = "Email ou senha incorretos!";
            mensagem.style.color = "red";
        }
    })
    .catch(error => {
        console.error(error);
        mensagem.textContent = "Erro ao conectar com o servidor!";
        mensagem.style.color = "red";
    });
}

function irParaCadastro() {
    window.location.href = "cadastro.html";
}