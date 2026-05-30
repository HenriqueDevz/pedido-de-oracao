const express = require("express");
const router = express.Router();
const db = require("../../db");
 
router.delete("/:id", function (req, res) {
    const id = Number(req.params.id);
 
    try {
        const remove = db.prepare("DELETE FROM prayers WHERE id = ?");
        remove.run(id);
        res.json({ message: "Prayer removed successfully." });
    } catch (error) {
        console.error("Error deleting prayer:", error);
        res.status(500).json({ message: "Error removing prayer." });
    }
});
 
module.exports = router;