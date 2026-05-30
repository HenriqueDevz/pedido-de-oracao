function loadPrayers() {

    fetch("/prayers")
    .then(function(response) {
        return response.json();
    })
    .then(function(prayers) {
        const tableBody = document.getElementById("tableBody");
        const noPrayers = document.getElementById("noPrayers");

        tableBody.innerHTML = "";

        if (prayers.length === 0) {
            noPrayers.style.display = "block";
            return;
        }

        prayers.forEach(function(prayer) {
            const row = document.createElement("tr");
            row.style.borderBottom = "1px solid #d4a85a";

            row.innerHTML = `
                <td style="padding: 12px; color: #999;">${prayer.id}</td>
                <td style="padding: 12px; font-weight: bold; color: #4a2f0a;">${prayer.name}</td>
                <td style="padding: 12px; color: #333;">${prayer.prayer}</td>
                <td style="padding: 12px; color: #999; font-size: 12px;">${prayer.date}</td>
                <td style="padding: 12px;">
                    <button onclick="deletePrayer(${prayer.id})" style="
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

            tableBody.appendChild(row);
        });
    });
}

function deletePrayer(id) {

    if (!confirm("Tem certeza que deseja excluir este pedido?")) return;

    fetch("/prayers/" + id, {
        method: "DELETE"
    })
    .then(function() {
        loadPrayers();
    });
}

document.addEventListener("DOMContentLoaded", function() {
    loadPrayers();
});