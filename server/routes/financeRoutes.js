const express = require("express");
const Finance = require("../models/Finance");
const auth = require("../middleware/authMiddleware");

const router = express.Router();


// SAVE OR UPDATE DATA
router.post("/save", auth, async (req, res) => {

    const { income, expense, investments, liabilities } = req.body;

    try {

        let finance = await Finance.findOne({ user: req.user.id });

        if (finance) {
            finance.income = income;
            finance.expense = expense;
            finance.investments = investments;
            finance.liabilities = liabilities;
            await finance.save();
        } else {
            finance = await Finance.create({
                user: req.user.id,
                income,
                expense,
                investments,
                liabilities
            });
        }

        res.json(finance);

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});


// GET USER DATA
router.get("/", auth, async (req, res) => {

    try {
        const finance = await Finance.findOne({ user: req.user.id });
        res.json(finance);
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// SAVE/UPDATE USER DATA (matches client POST /api/finance)
router.post("/", auth, async (req, res) => {

    const { income, expense, investments, liabilities } = req.body;

    try {

        let finance = await Finance.findOne({ user: req.user.id });

        if (finance) {
            finance.income = income;
            finance.expense = expense;
            finance.investments = investments;
            finance.liabilities = liabilities;
            await finance.save();
        } else {
            finance = await Finance.create({
                user: req.user.id,
                income,
                expense,
                investments,
                liabilities
            });
        }

        res.json(finance);

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

// UPDATE USER DATA
router.put("/", auth, async (req, res) => {

    const { income, expense, investments, liabilities, age, riskLevel } = req.body;

    try {

        let finance = await Finance.findOne({ user: req.user.id });

        if (finance) {
            // Update existing
            finance.income = income || finance.income;
            finance.expense = expense || finance.expense;
            finance.investments = investments || finance.investments;
            finance.liabilities = liabilities || finance.liabilities;
            await finance.save();
        } else {
            // Create new if doesn't exist
            finance = await Finance.create({
                user: req.user.id,
                income: income || 0,
                expense: expense || 0,
                investments: investments || {},
                liabilities: liabilities || {}
            });
        }

        res.json(finance);

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
});

module.exports = router;
