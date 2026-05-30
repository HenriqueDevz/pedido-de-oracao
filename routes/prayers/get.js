const express = require("express");
const router = express.Router();
const db = require("../../db");
 
router.get("/", function (req, res) {
    try {
        const query = db.prepare("SELECT * FROM prayers");
        const allprayers = query.all();
        res.json(allprayers);
    } catch (error) {
        console.error("Error fetching prayers:", error);
        res.status(500).json({ message: "Error fetching prayers." });
    }
});
 
module.exports = router;