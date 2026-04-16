const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../Frontend")));

// CONEXÃO COM O MYSQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "medtime"
});

// Teste de conexão
db.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao MySQL:", err);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

// ==========================
// ROTAS
// ==========================

// CADASTRO
app.post("/cadastro", (req, res) => {
    const { email, senha } = req.body;

    const sql = "INSERT INTO usuarios (email, senha) VALUES (?, ?)";

    db.query(sql, [email, senha], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Erro ao cadastrar");
        }
        res.send("Cadastro realizado com sucesso!");
    });
});

// LISTAR TODOS
app.get('/listar', (req, res) => {
    const sql = "SELECT * FROM usuarios";

    db.query(sql, (erro, resultados) => {
        if (erro) {
            return res.status(500).send("Erro ao listar!");
        }
        return res.json(resultados);
    });
});

// LISTAR POR ID
app.get('/listar/:id', (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM usuarios WHERE id = ?";

    db.query(sql, [id], (erro, resultados) => {
        if (erro) {
            return res.status(500).send("Erro ao listar!");
        }
        return res.json(resultados);
    });
});

// LOGIN
app.post("/login", (req, res) => {
    const { email, senha } = req.body;

    const sql = "SELECT * FROM usuarios WHERE email = ? AND senha = ?";

    db.query(sql, [email, senha], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ sucesso: false });
        }

        if (result.length > 0) {
            res.json({ sucesso: true });
        } else {
            res.json({ sucesso: false });
        }
    });
});

// DELETAR
app.delete('/deletar/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";

    db.query(sql, [id], (erro) => {
        if (erro) {
            return res.status(500).send("Erro ao deletar usuário!");
        }
        return res.send("Usuário deletado com sucesso!");
    });
});

// ATUALIZAR
app.put('/atualizar/:id', (req, res) => {
    const { id } = req.params;
    const { email, senha } = req.body;

    const sql = `
        UPDATE usuarios
        SET email = ?, senha = ?
        WHERE id = ?
    `;

    db.query(sql, [email, senha, id], (erro) => {
        if (erro) {
            return res.status(500).send("Erro ao atualizar usuário!");
        }
        res.send("Usuário atualizado com sucesso!");
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/login.html"));
});

// SERVIDOR
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});