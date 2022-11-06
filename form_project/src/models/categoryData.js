const mongoose = require("mongoose");

const category = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    ticketsLeft: {
        type: Number,
        required: true
    },
    totalTickets: {
        type: Number,
        required: true
    },
    value: {
        type: Number,
        required: true
    }  
})

//collection

const Category = new mongoose.model("Category", category);

module.exports = Category;