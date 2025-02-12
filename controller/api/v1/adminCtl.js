const Admin = require('../../../model/adminModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.adminRegister = async(req,res)=>{
    try{
        console.log(req.body);
        let adminEmailExist = await Admin.findOne({email:req.body.email})
        console.log(adminEmailExist);
        if(!adminEmailExist){
            if(req.body.password==req.body.confirmpassword){
                req.body.password = await bcrypt.hash(req.body.password,10);
                let adminData = await Admin.create(req.body);
                if(adminData){
                    return res.status(200).json({msg:"admin record added", adminData});
                } else{
                    return res.status(200).json({msg:"admin not added"});
                }
            } else{
                return res.status(200).json({msg:"password and confirmpassword are not matched"});
            }
        } else{
            return res.status(200).json({msg:"email already exist"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.adminLogin = async(req,res)=>{
    try{
        let checkAdmin = await Admin.findOne({email:req.body.email});
        if(checkAdmin){
            let checkpassword = await bcrypt.compare(req.body.password,checkAdmin.password);
            if(checkpassword){
                checkAdmin=checkAdmin.toObject();
                delete checkAdmin.password;
               let adminToken = await jwt.sign({adminData: checkAdmin},"SchoolAPI",{expiresIn: '1d'})
               return res.status(200).json({msg:"successfully login",adminToken:adminToken});
            }           
            else{
                return res.status(200).json({msg:"Invalid Password"});
            }
        }
        else{
            return res.status(200).json({msg:"email already exist"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.adminProfile = async(req,res)=>{
    try{
        return res.status(200).json({msg:'user Information', data:req.user});
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.editAdminProfile = async(req,res)=>{
    try{
        console.log(req.params.id);
        console.log(req.body);
        let checkAdminId = await Admin.findById(req.params.id);
        console.log(checkAdminId);
        if(checkAdminId){
            let updateAdminProfile = await Admin.findByIdAndUpdate(req.params.id,req.body);
            console.log(updateAdminProfile);
            if(updateAdminProfile){
                let updateProfile = await Admin.findById(req.params.id);
                return res.status(200).json({msg:'admin Profile Updated',data:updateProfile})
            }
            else{
                return res.status(200).json({msg:'admin Profile not Updated',data:updateProfile})
            }
        }
        else{
            return res.status(400).json({msg:"record not found"});
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.adminChangePassword = async(req,res)=>{
    try{
        console.log(req.user);
        console.log(req.body);
        let checkCurrentPassword = await bcrypt.compare(req.body.currentPassword,req.user.password);
        if(checkCurrentPassword){
            if(req.body.currentPassword!==req.body.newPassword){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.newPassword,10);
                    let updatePassword = await Admin.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        return res.status(200).json({msg:'password is changed!!'});    
                    }
                    else{
                        return res.status(200).json({msg:'something wrong'});    
                    }
                }
                else{
                    return res.status(200).json({msg:'new password and confirm password are not matched!!'})
                }
            }
            else{
                return res.status(200).json({msg:'current password and new password are same please try another password'})
            }
        }
        else{
            return res.status(200).json({msg:'current password not found!!'})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}