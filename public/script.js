const verses = [
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

let carouselIndex = 0;

let timeoutId = null;

function showRandomVerse() {
    const index = Math.floor(Math.random()* verses.length);
    document.getElementById("verse").textContent = verses[index];
}

function showCarousel(prayers) {
    const carousel = document.getElementById("carousel");

    if (prayers.length === 0) {
        carousel.innerHTML = "<p>Nenhum pedido ainda.</p>";
        return;
    }

    carousel.innerHTML = "";

    const item = prayers[carouselIndex];

    const div = document.createElement("div");
    const prayerText = document.createElement("p");
    prayerText.textContent = item.name + ": " + item.prayer;

    const dateText = document.createElement("p");
    dateText.textContent = "📅 " + item.date;
    div.appendChild(prayerText);
    div.appendChild(dateText);
    carousel.appendChild(div);

    carouselIndex = (carouselIndex + 1) % prayers.length;
}

function loadPrayers() {
    fetch("/prayers")
    .then(function(response) {
        return response.json();
    })
    .then(function(prayers) {
        showCarousel(prayers);
        if (timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(function() {
            loadPrayers();
        }, 6000);
    });
}

const form = document.getElementById("prayerForm");

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const prayer = document.getElementById("prayer").value;

    if (name === "" || prayer === "") {
        alert("Por Favor, preencha seu nome e seu pedido de oração!");
        return;
    }

    fetch("/prayers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            prayer: prayer
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function() {
        form.reset();
    });
});

document.addEventListener("DOMContentLoaded", function() {
    loadPrayers();
    showRandomVerse();
});