const express = require ("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");
const { JWT_SECRET } = require("../middleware/authMiddleware");


// POST /register
router.post("/register", async function (req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Email e senha são obrigatórios." });
    }
    if (password.length < 6) {
        return res.status(400).json({message: "A senha deve ter pelo menos 6 caracteres." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const created_at = new Date().toLocaleDateString("pt-BR");
        const insert = db.prepare("INSERT INTO users (email, password, created_at) VALUES (?, ?, ?)");
        
        insert.run(email, hashedPassword, created_at);
        
        res.status(201).json({message: "Usuários registrados com sucesso." });
    } catch (error) {
        if (error.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({message: "Este e-mail já esta cadastrado." });
        }
        console.error("Error registering user:", error);
        res.status(500).json({message: "Erro ao cadastrar usuário." });
    }
});

// POST /Login
router.post("/login", async function (req, res) {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: "Email e senha são obrigatórios."});
    }

    try {
        const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

        if (!user) {
            return res.status(401).json({message: "E-mail ou senha inválidos" });
        }

        const passwordMatch = await bcrypt.compare(password,user.password);

        if (!passwordMatch) {
            return res.status(401).json({message: "E-mail ou senha inválidos" });
        }

    const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        {expiresIn: "8h" });

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000
    });

    res.json({ success: true });
    } catch (error) {
        console.error("Error during login", error);
        res.status(500).json({message: "Erro ao realizar login." });
    }
});

router.get("/logout", function(req, res) {
    res.clearCookie("token");
    res.redirect("/");
});

module.exports = router;
