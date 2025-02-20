const Admin = require('../../../model/adminModel');
const Faculty = require('../../../model/FacultyModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

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
        if(checkAdminId){
            let updateAdminProfile = await Admin.findByIdAndUpdate(req.params.id,req.body);
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

module.exports.sendMail = async(req,res)=>{
    try{
        console.log(req.body);
        let checkemail = await Admin.findOne({email:req.body.email});
        if(checkemail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "srushtitejani20@gmail.com",
                  pass: "tgjjovktwihelkeb",
                },
                tls: {
                    rejectUnauthorized: false,
                }
              });

              let OTP = Math.round(Math.random()*1000000);

              const info = await transporter.sendMail({
                from: 'srushtitejani20@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "verification OTP", // Subject line
                html: `<b>OTP :${OTP}</b>`, // html body
              });

              const data = {
                email : req.body.email,OTP
              }
              if(info){
                return res.status(200).json({msg:'mail send successfully',data:data})
              }
              else{
                return res.status(200).json({msg:'mail not send', data:info});
              }
        }
        else{
            return res.status(400).json({msg:"invalid email"})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.updateForgetPassword = async(req,res)=>{
    try{
        console.log(req.query);
        console.log(req.body);
        let checkemail = await Admin.findOne({email:req.query.email})
        if(checkemail){
            if(req.body.newPassword==req.body.confirmPassword){
                req.body.newPassword = await bcrypt.hash(req.body.newPassword,10)
                let updatePassword = await Admin.findByIdAndUpdate(checkemail._id,req.body);
                if(updatePassword){
                    return res.status(200).json({msg:'password updated successfully'})
                }
                else{
                    return res.status(200).json({msg:'password not updated'})
                }
            }
            else{
                return res.status(200).json({msg:'password and confirm password are not matched'})
            }
        }
        else{
            return res.status(400).json({msg:"invalid email"})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.facultyRegistration = async(req,res)=>{
    try{
        let existEmail = await Faculty.findOne({email:req.body.email})
        if(!existEmail){
            var gpass = generatePassword();
            var link = "http://localhost:8080/api/";

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "srushtitejani20@gmail.com",
                  pass: "tgjjovktwihelkeb",
                },
                tls: {
                    rejectUnauthorized: false,
                }
              });

              const info = await transporter.sendMail({
                from: 'srushtitejani20@gmail.com', // sender address
                to: req.body.email, // list of receivers
                subject: "Faculty Registration", // Subject line
                html:  `<h1> your login details </h1>
                        <p> email : ${req.body.email} </p>
                        <p> password : ${gpass} </p>
                        <p> form login link here : ${link}</p>`, // html body
              });

              if(info){
                let encyGpass = await bcrypt.hash(gpass, 10);
                let addFaculty = await Faculty.create({
                    email:req.body.email, 
                    password:encyGpass, 
                    username:req.body.username
                })
                    return res.status(200).json({msg:"check your email for login", data: addFaculty})
            } else{
                return res.status(200).json({msg:"faculty not registered", data: info})
            }
        } else{
            return res.status(200).json({msg:'email already exist please try another email!!'})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

function generatePassword() {
    var length = 8,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}

module.exports.allFaculty = async(req,res)=>{
    try{
        
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}