const express = require("express");
const router = express.Router();
const db = require("../../db");
const { Resend } = require("resend");
const resend = new Resend (process.env.RESEND_API_KEY);
 
router.post("/", async function (req, res) {
    const { name, prayer } = req.body;
 
    if (!name || !prayer) {
        return res.status(400).json({ message: "Name and prayer are required." });
    }
    if (name.length > 100) {
        return res.status(400).json({ message: "Name is too long." });
    }
    if (prayer.length > 1000) {
        return res.status(400).json({ message: "Prayer is too long." });
    }
 
    try {
        const date = new Date().toLocaleString("pt-BR");
        const insert = db.prepare("INSERT INTO prayers (name, prayer, date) VALUES (?, ?, ?)");
        insert.run(name, prayer, date);

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: process.env.RESEND_TO,
            subject: "Novo pedido de oração recebido",
            html: `
            <h2> Novo pedido de Oração</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Pedido:</strong> ${prayer}</p>
            <p><strong>Data:</strong> ${date}</p>
        `
    });

        res.json({ message: "Pedido recebido com sucesso." });
    } catch (error) {
        console.error("Error saving prayer:", error);
        res.status(500).json({ message: "Erro ao salvar pedido, tente novamente." });
    }
});
 
module.exports = router;