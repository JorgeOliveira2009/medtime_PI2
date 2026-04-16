let lembretes = [];

function adicionarLembrete() {
  const nome = document.getElementById("nomeRemedio").value;
  const horario = document.getElementById("horario").value;

  if (!nome || !horario) {
    alert("Preencha tudo!");
    return;
  }

  lembretes.push({ nome, horario });

  atualizarLista();
}

function atualizarLista() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  lembretes.forEach((l) => {
    const li = document.createElement("li");
    li.textContent = `${l.nome} - ${l.horario}`;
    lista.appendChild(li);
  });
}

// 🔔 VERIFICA O HORÁRIO A CADA SEGUNDO
setInterval(() => {
  const agora = new Date();
  const horaAtual = agora.toTimeString().slice(0, 5); // HH:MM

  lembretes.forEach((l) => {
    if (l.horario === horaAtual) {
      mostrarAlerta(`Hora de tomar: ${l.nome}`);
    }
  });
}, 1000);

function mostrarAlerta(msg) {
  const alerta = document.getElementById("alerta");
  alerta.textContent = msg;

  // alerta popup também
  alert(msg);
}