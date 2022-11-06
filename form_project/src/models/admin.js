const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    confirmPassword: {
        type: String,
        required:true
    }
})

//collection

const Admin = new mongoose.model("melaAdmin", adminSchema);

module.exports =Admin;