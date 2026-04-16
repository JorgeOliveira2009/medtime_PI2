function cadastrar() {
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    if (!email || !senha) {
        mensagem.textContent = "Preencha todos os campos!";
        mensagem.style.color = "red";
        return;
    }

    fetch("http://localhost:3000/cadastro", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            senha: senha
        })
    })
    .then(res => res.text())
    .then(msg => {
        mensagem.textContent = msg;
        mensagem.style.color = "green";

        // 👇 COLE AQUI (redireciona depois do cadastro)
        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    })
    .catch(err => {
        console.error(err);
        mensagem.textContent = "Erro ao cadastrar!";
        mensagem.style.color = "red";
    });
}

