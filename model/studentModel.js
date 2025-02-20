const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
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
        default: 'Student'
    },
    status:{
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

const Student = mongoose.model("Student",studentSchema);
module.exports = Student;