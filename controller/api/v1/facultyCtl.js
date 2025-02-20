const Faculty = require("../../../model/FacultyModel");
const Student = require("../../../model/studentModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

module.exports.facultyLogin = async(req,res)=>{
    try{
        console.log(req.body);
        let checkFaculty = await Faculty.findOne({email: req.body.email});
        if(checkFaculty){
            if(await bcrypt.compare(req.body.password,checkFaculty.password)){
                checkFaculty = checkFaculty.toObject();
                delete checkFaculty.password;
                let facultyToken =  jwt.sign({ft: checkFaculty},'FAPI',{expiresIn: '1h'});
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

module.exports.sendMail = async(req,res)=>{
    try{
        console.log(req.body);
        let checkemail = await Faculty.findOne({email:req.body.email});
        if(checkemail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "srushtitejani20@gmail.com",
                  pass: "vepkyadletaxxjsz",
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

module.exports.updateForgetFacultyPassword = async(req,res)=>{
    try{
        console.log(req.query);
        console.log(req.body);
        let checkFacultyemail = await Faculty.findOne({email:req.query.email});
        if(checkFacultyemail){
            if(req.body.newPassword==req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.newPassword,10);
                let updateFacultyPassword = await Faculty.findByIdAndUpdate(checkFacultyemail._id,req.body);
                if(updateFacultyPassword){
                    return res.status(200).json({msg:'password updated successfully', data:updateFacultyPassword})
                } else{
                    return res.status(200).json({msg:'password not updated'});      
                }
            } else{
                return res.status(200).json({msg:'new-password and confirm-password are not matched'})
            }
        } else{
            return res.status(200).json({msg:'invalid email'})
        }
    }
    catch(err){
        return res.status(400).json({msg:"something wrong", error:err});
    }
}

module.exports.FacultyPasswordChange = async(req,res)=>{
    try{
        console.log(req.user);   
        console.log(req.body);
        let checkCurrentPassword = await bcrypt.compare(req.body.currentPassword,res.user.password);
        if(checkCurrentPassword){
            if(req.body.currentPassword!=req.body.newPassword){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.newPassword,10)
                    let updatePassword = await Faculty.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        return res.status(200).json({msg:'password is changed!!'});    
                    }
                    else{
                        return res.status(200).json({msg:'something wrong'});    
                    }
                } else{
                    return res.status(200).json({msg:'new password and confirm password are not matched'})
                }
            } else{
            return res.status(200).json({msg:'current password and new password are same please try another password'})
            }
        } else{
            return res.status(200).json({msg:'current password not found'})
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong', error:err})
    }
}

module.exports.studentRegistration = async(req,res)=>{
    try{
        let existEmail = await Student.findOne({email:req.body.email})
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
                subject: "Studentx Registration", // Subject line
                html:  `<h1> your login details </h1>
                        <p> email : ${req.body.email} </p>
                        <p> password : ${gpass} </p>
                        <p> form login link here : ${link}</p>`, // html body
              });

              if(info){
                let encyGpass = await bcrypt.hash(gpass, 10);
                let addStudent = await Student.create({
                    email:req.body.email, 
                    password:encyGpass, 
                    username:req.body.username
                })
                    return res.status(200).json({msg:"check your email for login", data: addStudent})
            } else{
                return res.status(200).json({msg:"student not registered", data: info})
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
