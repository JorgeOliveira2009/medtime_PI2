// 🔒 Proteção: só entra se estiver logado
if (localStorage.getItem("logado") !== "true") {
    window.location.href = "login.html";
}

// Carrega lembretes ao abrir
window.onload = function () {
    carregarLembretes();
};

// ⏰ VERIFICAÇÃO DE ALERTA
setInterval(verificarLembretes, 60000); // a cada 1 minuto

function verificarLembretes() {
    const agora = new Date();
    const horaAtual = agora.toTimeString().slice(0, 5); // HH:MM

    let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];

    lembretes.forEach((lembrete) => {
        if (!lembrete.tomado && lembrete.horario === horaAtual) {
            alert(`💊 Hora de tomar: ${lembrete.nome}`);
            lembrete.tomado = true; 
        }
    });

    localStorage.setItem("lembretes", JSON.stringify(lembretes));
}

// ➕ ADICIONAR LEMBRETE
function adicionarLembrete() {
    const nome = document.getElementById("nomeRemedio").value;
    const horario = document.getElementById("horario").value;

    if (!nome || !horario) {
        alert("Preencha o nome do remédio e o horário!");
        return;
    }

    const lembrete = {
        nome: nome,
        horario: horario,
        tomado: false
    };

    let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
    lembretes.push(lembrete);

    localStorage.setItem("lembretes", JSON.stringify(lembretes));

    document.getElementById("nomeRemedio").value = "";
    document.getElementById("horario").value = "";

    carregarLembretes();
}

// 📋 MOSTRAR LEMBRETES
function carregarLembretes() {
    const lista = document.getElementById("lista");
    if (!lista) return;

    lista.innerHTML = "";

    let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];

    lembretes.forEach((lembrete, index) => {
        if (!lembrete.tomado) {
            const item = document.createElement("li");
            item.innerHTML = `
                ${lembrete.nome} - ${lembrete.horario}
                <button onclick="marcarComoTomado(${index})">Já tomei</button>
            `;
            lista.appendChild(item);
        }
    });
}

// ✔ MARCAR COMO TOMADO
function marcarComoTomado(index) {
    let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
    lembretes[index].tomado = true;

    localStorage.setItem("lembretes", JSON.stringify(lembretes));
    carregarLembretes();
}

// 🚪 LOGOUT
function logout() {
    localStorage.removeItem("logado");
    window.location.href = "login.html";
}