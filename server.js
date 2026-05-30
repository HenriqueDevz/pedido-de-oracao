require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRoutes = require("./routes/auth")
const prayerRoutes = require("./routes/prayers");
const { authenticateToken } = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(authRoutes);

app.use("/prayers", prayerRoutes);

app.get("/index.html", authenticateToken, function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/prayers.html", authenticateToken, function(req, res) {
    res.sendFile(path.join(__dirname, "public", "prayers.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.use(express.static("public"));


app.listen(3000, function() {
    console.log("Server running on port 3000");
});