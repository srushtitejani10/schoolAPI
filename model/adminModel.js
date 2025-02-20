const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    role:{
        type : String,
        default: 'Admin'
    },
    status:{
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

const Admin = mongoose.model("Admin",adminSchema);
module.exports = Admin;