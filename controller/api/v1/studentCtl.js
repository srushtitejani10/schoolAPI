const Student = require("../../../model/studentModel");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const Faculty = require("../../../model/FacultyModel");

module.exports.studentLogin = async(req,res)=>{
    try{
        console.log(req.body);   
        let checkStudent = await Student.findOne({email:req.body.email});
        if(checkStudent){
            if(await bcrypt.compare(req.body.password,checkStudent.password)){
                let studentToken = jwt.sign({studentData : checkStudent},'SAPI',{expiresIn:'1h'})
                return res.status(200).json({msg:'student login successfully', studentData : studentToken})
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
        return res.status(400).json({msg:'something wrong', error:err})
    }
}

module.exports.studentProfile = async(req,res)=>{
    try{
        return res.status(200).json({msg:'user Information', data:req.user})
    }
    catch(err){
        return res.status(400).json({msg:'something wrong', error:err})
    }
}

module.exports.editStudentProfile = async(req,res)=>{
    try{
        console.log(req.params.id);
        console.log(req.body);
        checkStudentId = await Student.findById(req.params.id);
        if(checkStudentId){
            let updateStudentProfile = await Student.findByIdAndUpdate(req.params.id,req.body);
            if(updateStudentProfile){
                updateProfile = await Student.findById(req.params.id);
                return res.status(200).json({msg:'Student profile updated', data:updateProfile});
            }
            else{
                return res.status(200).json({msg:'Student profile not updated', data:updateProfile})
            }
        }
        else{
            return res.status(400).json({msg:'record not found'});
        }
    }
    catch(err){
        return res.status(400).json({msg:'something wrong', error:err})
    }
}

module.exports.changeStudentPassword = async (req,res)=>{
    try{
        console.log(req.user);
        console.log(req.body);
        let checkCurrentPassword = await bcrypt.compare(req.body.currentPassword,req.user.password);
        console.log(checkCurrentPassword);
        if(checkCurrentPassword){
            if(req.body.currentPassword!=req.body.newPassword){
                if(req.body.newPassword==req.body.confirmPassword){
                    req.body.password = await bcrypt.hash(req.body.newPassword,10);
                    let updatePassword = await Student.findByIdAndUpdate(req.user._id,req.body);
                    if(updatePassword){
                        return res.status(200).json({msg:'password change successfully'})
                    } else{
                        return res.status(200).json({msg:'something wrong'})
                    }
                } else{
                    return res.status(200).json({msg:'new-password And  confirm-password are not matched'})
                }
            } else{
                return res.status(200).json({msg:'current password And new password are same!! try another password'})
            }
        } else{
            return res.status(200).json({msg:'current password not found'})
        }
        
    }
    catch(err){
        console.log(err);
        
        return res.status(400).json({msg:'something wrong', error:err});
    }
}

module.exports.sendMail = async(req,res)=>{
    try{
        console.log(req.body);
        let checkemail = await Student.findOne({email:req.body.email});
        if(checkemail){
            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for port 465, false for other ports
                auth: {
                  user: "srushtitejani20@gmail.com",
                  pass: "lcptlhdrtevzvxxf",
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
        console.log(err);
        
        return res.status(400).json({msg:'something wrong', error:err})
    }
}

module.exports.forgetStudentPassword = async(req,res)=>{
    try{
        console.log(req.query);
        console.log(req.body);
        let checkStudentEmail = await Student.findOne({email:req.query.email});
        if(checkStudentEmail){
            if(req.body.newPassword==req.body.confirmPassword){
                req.body.password = await bcrypt.hash(req.body.newPassword,10);
                let updateStudentPassword = await Student.findByIdAndUpdate(checkStudentEmail._id,req.body);
                if(updateStudentPassword){
                    return res.status(200).json({msg:'password update successfully',data:updateStudentPassword})
                } else{
                    return res.status(200).json({msg:'password not update'})
                }
            } else{
                return res.status(200).json({msg:'new-password and confirm-password are not matched'})
            }
        } else{
            return res.status(400).json({msg:'invalid email'})
        }

    }
    catch(err){
        return res.status(400).json({msg:'something wrong', error:err})
    }
}