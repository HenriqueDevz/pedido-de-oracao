const express = require("express");
// Traga a biblioteca do Express para criar o servidor web e lidar com as rotas e requisições HTTP.
const Database = require("better-sqlite3")
// Traz a biblioteca que acabamos de instalar
// Ela permite conversar com um arquivo de bando de dados SQlite
const db = new Database(__dirname + "/pedidos.db");

const SENHA_ADMIN = "oracao2026";
// __dirname é uma variavel especial do node.js que contem um caminho completo da pasta onde o server.js esta . Assim o banco sempre é criado na mesma pasta que o server.js
// Cria(ou abre, se existir) um arquivo chamado "pedido.db"
// dentro da pasta projeto. É nesse arquivo que os dados ficam salvos
db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT,
        pedido TEXT,
        data TEXT
    )
`);

const app = express();
// Cria uma aplicação ao Servidor usando o Express, permitindo que você defina rotas e manipule requisições.

app.use(express.json());
// Permite que o servidor entenda e processe dados no formato JSON, facilitando a comunicação entre o cliente e o servidor.

const session = require("express-session");
// Traga a biblioteca "express-session", que é usada para gerenciar sessões de usuário no servidor. Isso permite que o servidor mantenha informações sobre os usuários entre as requisições, como se eles estão logados ou não.
app.use(session({
    secret: "leao-de-juda-2026",
    // Define uma chave secreta para a sessão
    resave: false,
    // Evita que a sessão seja salva novamente se não houver alterações
    saveUninitialized: false
    // Evita que sessões vazias sejam salvas

}));

app.post("/login", function(req, res) {
    const senhaDigitada = req.body.senha;
    // Extrai o valor do campo "senha" do corpo da requisição (req.body) e o armazena na variável "senhaDigitada". Isso é útil para obter a senha que o cliente está tentando usar para fazer login.

    if (senhaDigitada === SENHA_ADMIN) {
        req.session.logado = true;
        // Se a senha digitada for igual à senha de administrador (SENHA_ADMIN), o servidor define uma propriedade "logado" como true na sessão do usuário (req.session). Isso indica que o usuário está autenticado e pode acessar áreas restritas do sistema.
        res.json({sucesso : true});
    } else {
        res.json({sucesso : false});
    }
});

function verficarLogin(req, res, next) {
    if (req.session.logado) {
        next();
        // Se o usuário estiver logado (req.session.logado é true), a função chama next(), permitindo que a requisição continue para a próxima etapa, como acessar uma rota protegida ou realizar uma ação específica.
    } else {
        res.redirect ("/");
        // Se o usuário não estiver logado, a função redireciona a requisição para a página raiz ("/"), que geralmente é a página de login. Isso impede que usuários não autenticados acessem áreas restritas do sistema.
    }
}

app.post("/pedidos", function(req, res) {
    console.log("POST chamado");
    // Define uma rota POST para o caminho "/pedidos". Quando um cliente fizer uma requisição POST para essa rota, a função de callback será executada, permitindo que o servidor processe os dados do pedido enviado pelo cliente.

    const nome = req.body.nome;
    // Extrai o valor do campo "nome" do corpo da requisição (req.body) e o armazena na variável "nome". Isso é útil para obter informações enviadas pelo cliente, como o nome do cliente que está fazendo o pedido.
    const pedido = req.body.pedido;
    // Extrai o valor do campo "pedido" do corpo da requisição (req.body) e o armazena na variável "pedido". Isso é útil para obter informações sobre o pedido que o cliente está fazendo, como os itens ou detalhes do pedido.
    if (!nome || !pedido) {
        res.status(400).json({mensagem: "Nome e pedido são obrigatórios"});
    // Verifica se o nome ou o pedido estão vazios. Se algum deles estiver vazio, o servidor responde com um status HTTP 400 (Bad Request) e uma mensagem JSON indicando que ambos os campos são obrigatórios. Isso ajuda a garantir que o cliente forneça as informações necessárias para processar o pedido corretamente.
    }
    if (nome.length > 20) {
        return res.status(400).json({mensagem: "Nome muito longo."});
    // Verifica se o nome fornecido pelo cliente tem mais de 100 caracteres. Se for o caso, o servidor responde com um status HTTP 400 (Bad Request) e uma mensagem JSON indicando que o nome é muito longo. Isso ajuda a evitar que dados excessivamente longos sejam armazenados no banco de dados, garantindo a integridade dos dados e melhorando a experiência do usuário.
    }
    if (pedido.length > 1000) {
        return res.status(400).json({mensagem: "Pedido muito longo."});
    // Verifica se o pedido fornecido pelo cliente tem mais de 1000 caracteres. Se for o caso, o servidor responde com um status HTTP 400 (Bad Request) e uma mensagem JSON indicando que o pedido é muito longo. Isso ajuda a evitar que dados excessivamente longos sejam armazenados no banco de dados, garantindo a integridade dos dados e melhorando a experiência do usuário.
    }
    
    try {
        const agora = new Date().toLocaleString("pt-BR");
        const inserir = db.prepare("INSERT INTO pedidos (nome, pedido,data) VALUES (?, ?, ?)");
        inserir.run(nome, pedido, agora);
        res.json({mensagem: "Pedido recebido com sucesso" });
    } catch (error) {
        console.error("Erro ao salvar o pedido :", error);
        res.status(500).json({mensagem: "Erro ao salvar o pedido. Tente novamente."});
        // Se ocorrer um erro ao tentar salvar o pedido no banco de dados, o servidor captura o erro e responde com um status HTTP 500 (Internal Server Error) e uma mensagem JSON indicando que houve um erro ao salvar o pedido, sugerindo que o cliente tente novamente. Isso ajuda a lidar com situações inesperadas e a fornecer feedback útil para o cliente em caso de falhas no servidor.
    }
      
});
app.delete("/pedidos/:id", function(req, res) {
// Cria uma rota DELETE com parametro ":id". Quando um cliente fizer uma requisição DELETE para essa rota, a função de callback será executada, permitindo que o servidor remova um pedido específico com base no ID fornecido na URL.
    const id = Number(req.params.id);
    // Pega o ID da URL (req.params.id) e o converte para um número usando Number(). Isso é útil para garantir que o ID seja tratado como um número, facilitando a comparação e a remoção do pedido correto da lista de pedidos.
    try {
    const deletar = db.prepare("DELETE FROM pedidos WHERE id = ?");
    // DELETE FROM pedidos — apaga uma linha da tabela pedidos.
    // WHERE id = ? — mas só a linha cujo id for igual
    // ao ? que vamos passar abaixo.
    deletar.run(id);
    res.json({mensagem: "Pedido removido com sucesso!"});
    }catch (error) {
        console.error("Erro ao deletar o pedido:", error);
        res.status(500).json({mensagem: "Erro ao remover o pedido."});
    }
    // Executa o comando passando o id como valor do ?.
    // O banco apaga exatamente aquele pedido.

    res.json ({mensagem: "Pedido removido com sucessso!"});
});

app.get("/pedidos", function(req, res) {
    try {
        const buscar = db.prepare("SELECT * FROM pedidos");
        // db.prepare() prepara um comando SQL de busca.
        // SELECT * FROM pedidos — busca todas as colunas (*)
        // de todas as linhas da tabela pedidos.
        // Define uma rota GET para o caminho "/pedidos". Quando um cliente fizer uma requisição GET para essa rota, a função de callback será executada.
    const todosPedidos = buscar.all();
    res.json(todosPedidos);
    } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        res.status(500).json({mensagem: "Erro ao buscar pedidos."});
    }
    // .all() executa o comando e retorna todos os resultados
    // como uma lista — igual ao nosso array de antes,
    // mas vindo do banco de dados.

});

const path = require("path");
// Traga a biblioteca "path" do Node.js, que fornece utilitários para trabalhar com caminhos de arquivos e diretórios. Isso é útil para construir caminhos de forma segura e compatível com diferentes sistemas operacionais.

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "login.html"));
// Define uma rota GET para o caminho raiz ("/"). Quando um cliente fizer uma requisição GET para essa rota, a função de callback será executada, enviando o arquivo "index.html" localizado na pasta "public" como resposta. O método "path.join" é usado para construir o caminho do arquivo de forma segura, garantindo que ele funcione corretamente em diferentes sistemas operacionais.
});

app.get("/index.html", verficarLogin, function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
// Define uma rota GET para o caminho "/index.html". Antes de enviar o arquivo "index.html", a função "verficarLogin" é chamada para verificar se o usuário está autenticado. Se o usuário estiver logado, a função de callback é executada, enviando o arquivo "index.html" localizado na pasta "public" como resposta. Caso contrário, o usuário será redirecionado para a página de login.
})

app.use(express.static("public"));

app.get("/logout", function(req, res) {
    req.session.destroy();
    // destroy() apaga completamente a sessão do usuário.
    // É como rasgar o crachá — precisa fazer login de novo.
    res.redirect("/");
    // Redireciona para a página de login.
});

app.listen(3000, function() {
    console.log("Servidor rodando na porta 3000");

});



// app.listen(3000, function() {
// Ligue o servidor na porta 3000, permitindo que ele escute as requisições HTTP. Quando o servidor estiver rodando, a função de callback é executada, exibindo a mensagem "Servidor rodando na porta 3000" no console para indicar que o servidor está ativo e pronto para receber requisições.