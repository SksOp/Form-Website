const mongoose = require("mongoose");

const haath = new mongoose.Schema({
    serialNo: {
        type: Number,
        required:true
    }
})

//collection

const Haath = new mongoose.model("Haath", haath);

module.exports = Haath;