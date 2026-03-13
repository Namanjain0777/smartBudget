const mongoose = require("mongoose");

const financeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    income: { type: Number, default: 0 },
    expense: { type: Number, default: 0 },
    investments: { type: Object, default: {} },
    liabilities: { type: Object, default: {} }
}, { timestamps: true });

module.exports = mongoose.model("Finance", financeSchema);