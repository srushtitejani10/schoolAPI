const Faculty = require("../../../model/FacultyModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

module.exports.facultyLogin = async(req,res)=>{
    try{
        console.log(req.body);
        let checkFacultyEmail = await Faculty.findOne({email: req.body.email});
        if(checkFacultyEmail){
            if(await bcrypt.compare(req.body.password,checkFacultyEmail.password)){
                let facultyToken =  jwt.sign({ft: checkFacultyEmail},'FAPI',{expiresIn: '1h'});
                return res.status(200).json({msg:'faculty login successfully', ft: facultyToken})
            }
            else{
                return res.status(200).json({msg:'invalid password'})
            }
        }
        else{
            return res.status(200).json({msg:'invalid email'})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err})
    }
}

module.exports.facultyProfile = async(req,res)=>{
    try{
        console.log(req.user);
        
        return res.status(200).json({msg:'user Information', data: req.user});
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.editFacultyProfile = async(req,res)=>{
    try{
        console.log(req.params.id);
        console.log(req.body);
        let checkFacultyId = await Faculty.findById(req.params.id);
        console.log(checkFacultyId);
        
        if(checkFacultyId){
            let updateFacultyProfile = await Faculty.findByIdAndUpdate(req.params.id,req.body);
            if(updateFacultyProfile){
                let updateProfile = await Faculty.findById(req.params.id);
                return res.status(200).json({msg:"Faculty profile updated", data:updateProfile});
            } else{
                return res.status(200).json({msg:"Faculty profile not updated", data:updateProfile});
            }
        } else{
            return res.status(400).json({msg:"record not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}