const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
    phoneNumber: {
        type: Number,
        required:true,
        unique:true
    },
    password: {
        type: String,
        required:true
    },
    name: {
        type: String,
        required:true,
    },
    co: {
        type: String,
        required:true,
    },
    shopAdd: {
        type: String,
        required:true,
    },
    permaAdd: {
        type: String,
        required:true,
    },
    town: {
        type: String,
        required:true,
    },
    po: {
        type: String,
        required:true,
    },
    district: {
        type: String,
        required:true,
    },
    state: {
        type: String,
        required:true,
    },
    pincode: {
        type: Number,
        required:true,
    },
    wNo: {
        type: String,
        required:false
    },
    email: {
        type: String,
        required:false,
        unique:false
    },
    price: {
        type: Number,
        required:true,
    },
    category: {
        type: String,
        required:true,
    },
    noOfTicets: {
        type: Number,
        required:true,
    },
    aadharFLink: {
        type: String,
        required:true,
    },
    aadharBLink: {
        type: String,
        required:true,
    },
    tradeLicLinkF: {
        type: String
    },
    tradeLicLinkB: {
        type: String
    },
    appreciationLetLink: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    hasPaid: {
        type: Boolean,
        default: false
    },
    fillupDate: {
        type: String,
    },
    fillupTime: {
        type: String,
    },
    serialNo: {
        type: String,
        require: true
    }
})

//collection

const Register = new mongoose.model("Register", formSchema);

module.exports = Register;