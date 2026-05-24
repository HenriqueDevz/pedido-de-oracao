const express = require("express");
const Database = require("better-sqlite3")
const db = new Database(__dirname + "/pedidos.db");

const SENHA_ADMIN = "oracao2026";
db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        pedido TEXT,
        data TEXT
    )
`);

const app = express();

app.use(express.json());

const session = require("express-session");
app.use(session({
    secret: "leao-de-juda-2026",
    resave: false,
    saveUninitialized: false
}));

app.post("/login", function(req, res) {
    const senhaDigitada = req.body.senha;
    if (senhaDigitada === SENHA_ADMIN) {
        req.session.logado = true;
        res.json({sucesso : true});
    } else {
        res.json({sucesso : false});
    }
});

function verificarLogin(req, res, next) {
    if (req.session.logado) {
        next();
    } else {
        res.redirect ("/");
    }
}

app.post("/pedidos", function(req, res) {
    console.log("POST chamado");
    const nome = req.body.nome;
    const pedido = req.body.pedido;
    if (!nome || !pedido) {
        res.status(400).json({mensagem: "Nome e pedido são obrigatórios"});
    }
    if (nome.length > 20) {
        return res.status(400).json({mensagem: "Nome muito longo."});
    }
    if (pedido.length > 1000) {
        return res.status(400).json({mensagem: "Pedido muito longo."});
    }
    
    try {
        const agora = new Date().toLocaleString("pt-BR");
        const inserir = db.prepare("INSERT INTO pedidos (nome, pedido,data) VALUES (?, ?, ?)");
        inserir.run(nome, pedido, agora);
        res.json({mensagem: "Pedido recebido com sucesso" });
    } catch (error) {
        console.error("Erro ao salvar o pedido :", error);
        res.status(500).json({mensagem: "Erro ao salvar o pedido. Tente novamente."});
    }
      
});
app.delete("/pedidos/:id", function(req, res) {
    const id = Number(req.params.id);
    try {
    const deletar = db.prepare("DELETE FROM pedidos WHERE id = ?");
    deletar.run(id);
    res.json({mensagem: "Pedido removido com sucesso!"});
    }catch (error) {
        console.error("Erro ao deletar o pedido:", error);
        res.status(500).json({mensagem: "Erro ao remover o pedido."});
    }

    res.json ({mensagem: "Pedido removido com sucessso!"});
});

app.get("/pedidos.html", verificarLogin, function(req, res) {
    res.sendFile(path.join(__dirname, "public", "pedidos.html"));
});

const path = require("path");

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/index.html", verificarLogin, function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.use(express.static("public"));

app.get("/logout", function(req, res) {
    req.session.destroy();
    res.redirect("/");
});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");
});