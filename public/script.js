const versiculos = [
    // Apoio emocional
    "\"O Senhor é o meu pastor e nada me faltará.\" — Salmos 23:1",
    "\"Lançai sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.\" — 1 Pedro 5:7",
    "\"Não andeis ansiosos por coisa alguma.\" — Filipenses 4:6",
    "\"Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.\" — Salmos 46:1",
    "\"Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.\" — Mateus 11:28",
    "\"Ainda que eu ande pelo vale da sombra da morte, não temerei mal algum.\" — Salmos 23:4",
    "\"O Senhor está perto dos que têm o coração quebrantado.\" — Salmos 34:18",
    "\"Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus.\" — Isaías 41:10",
    "\"A paz de Deus, que excede todo o entendimento, guardará os vossos corações.\" — Filipenses 4:7",
    "\"Ele cura os de coração quebrantado e lhes sara as feridas.\" — Salmos 147:3",

    // Promessas de Deus
    "\"Porque sou eu que conheço os planos que tenho para vocês, planos de paz e não de calamidade.\" — Jeremias 29:11",
    "\"Tudo posso naquele que me fortalece.\" — Filipenses 4:13",
    "\"Entrega o teu caminho ao Senhor, confia nele, e ele tudo fará.\" — Salmos 37:5",
    "\"Pedi e dar-se-vos-á; buscai e achareis; batei e abrir-se-vos-á.\" — Mateus 7:7",
    "\"O Senhor te abençoará e te guardará.\" — Números 6:24",
    "\"Nunca te deixarei nem te abandonarei.\" — Hebreus 13:5",
    "\"Se Deus é por nós, quem será contra nós?\" — Romanos 8:31",
    "\"Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.\" — Salmos 91:1",
    "\"Busquei o Senhor, e ele me respondeu; livrou-me de todos os meus temores.\" — Salmos 34:4",
    "\"Nenhuma arma forjada contra ti prosperará.\" — Isaías 54:17",

    // Jesus
    "\"Eu sou o caminho, a verdade e a vida.\" — João 14:6",
    "\"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.\" — João 3:16",
    "\"Eu vim para que tenham vida e a tenham em abundância.\" — João 10:10",
    "\"Eu sou a ressurreição e a vida; quem crê em mim, ainda que morra, viverá.\" — João 11:25",
    "\"Nisto conhecerão todos que sois meus discípulos: se tiverdes amor uns aos outros.\" — João 13:35",
    "\"Na minha casa há muitas moradas; vou preparar lugar para vós.\" — João 14:2",

    // Família
    "\"Honra teu pai e tua mãe, para que se prolonguem os teus dias.\" — Êxodo 20:12",
    "\"Eu e a minha casa serviremos ao Senhor.\" — Josué 24:15",
    "\"Os filhos são herança do Senhor, o fruto do ventre é o seu galardão.\" — Salmos 127:3",
    "\"Instruí o menino no caminho em que deve andar, e quando envelhecer não se desviará dele.\" — Provérbios 22:6",
    "\"O amor é paciente, o amor é bondoso... tudo suporta, tudo crê, tudo espera.\" — 1 Coríntios 13:4-7",
    "\"Acima de tudo, porém, revesti-vos do amor, que é o vínculo da perfeição.\" — Colossenses 3:14"
];

function mostrarVersiculo() {
    const indice = Math.floor(Math.random() * versiculos.length);
    const versiculo = versiculos[indice];
    document.getElementById("versiculo").textContent = versiculo;
}

let indicePedido = 0;


function mostrarCarrossel(pedidos) {
    const carrossel = document.getElementById("carrossel");

    if (pedidos.length === 0) {
        carrossel.innerHTML = "<p>Nenhum pedido ainda.</p>";
        return;
    }

    carrossel.innerHTML = "";

    const item = pedidos[indicePedido];

    const div = document.createElement("div");
    const textoPedido = document.createElement("p");
    textoPedido.textContent = item.nome + ": " + item.pedido;

    const textoData = document.createElement("p");
    textoData.textContent = "📅 " + item.data;
    div.appendChild(textoPedido);
    div.appendChild(textoData);

    carrossel.appendChild(div);

    indicePedido = (indicePedido + 1) % pedidos.length;
}

let timeoutId = null;

function mostrarPedidos() {
    fetch("/pedidos")
    .then(function(resposta) {
        return resposta.json();
    })
    .then(function(pedidos) {
        mostrarCarrossel(pedidos);
        if (timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function() {
            mostrarPedidos();
        }, 6000);
    });
}

function excluirPedido(id) {
    fetch("/pedidos/" + id, {
        method: "DELETE"
    })
    .then(function() {
        indicePedido = 0;
        mostrarPedidos();
    });
}

const formulario = document.getElementById("formPedido");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const pedido = document.getElementById("pedido").value;

    if (nome === "" || pedido === "") {
        alert("Por Favor, preencha seu nome e seu pedido de oração!");
        return;
    }

    fetch("/pedidos", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            nome: nome,
            pedido: pedido
        })
    })
    .then(function(resposta) {
        return resposta.json();
    })
    .then(function() {
        formulario.reset();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    mostrarPedidos();
    mostrarVersiculo();
});

document.addEventListener("DOMContentLoaded", function() {
    mostrarPedidos();
});