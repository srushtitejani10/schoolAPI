const mongoose = require('mongoose');

const facultySchema = mongoose.Schema({
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
        default: 'Faculty'
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Admin"
    },
    students:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    }],
    status:{
        type : Boolean,
        default : true
    }
},{
    timestamps : true
})

const Faculty = mongoose.model("Faculty",facultySchema);
module.exports = Faculty;