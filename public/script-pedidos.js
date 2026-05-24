function carregarPedidos() {
    fetch("/pedidos")
    .then(function(resposta) {
        return resposta.json();
    })
    .then(function(pedidos) {
        const corpo = document.getElementById("corpoTabela");
        const semPedidos = document.getElementById("semPedidos");

        corpo.innerHTML = "";

        if (pedidos.length === 0) {
            semPedidos.style.display = "block";
            return;
        }

        pedidos.forEach(function(pedido) {
            const linha = document.createElement("tr");
            linha.style.borderBottom = "1px solid #d4a85a";

            linha.innerHTML = `
                <td style="padding: 12px; color: #999;"${item.id}</td>
                <td style="padding: 12px; font-weight: bold; color: #4a2f0a;">${item.nome}</td>
                <td style="padding: 12px; color: #333;">${item.pedido}</td>
                <td style="padding: 12px; color: #999; font-size: 12px;">${item.data}</td>
                <td style="padding: 12px:">
                    <button onclick="excluirPedido(${item.id})" style="
                        background-color: #c0392b;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 12px;
                        width: auto;
                    ">Excluir</button>
                </td>
            `; 

            corpo.appendChild(linha);
        });
    });
}

function excluirPedido(id) {
    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    fetch("/pedidos/" + id, {
        method: "DELETE"
    })
    .then(function() {
        carregarPedidos();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    carregarPedidos();
});
