const express = require('express');

const routes = express.Router();

const studentCtl = require('../../../../controller/api/v1/studentCtl');

const passport = require('passport');
const { resolveHostname } = require('nodemailer/lib/shared');


// Student Login
routes.post('/studentLogin',studentCtl.studentLogin);

// Student Profile
routes.get('/studentProfile',passport.authenticate('student',{failureRedirect:'/api/faculty/student/studentFailLogin'}),studentCtl.studentProfile);

routes.put('/editStudentProfile/:id',passport.authenticate('student',{failureRedirect:'/api/faculty/student/studentFailLogin'}),studentCtl.editStudentProfile)

routes.get('/studentFailLogin',async(req,res)=>{
    try{
        return res.status(401).json({msg:'invalid token'});
    }
    catch(err){
        return res.status(400).json({msg:'something wrong', error:err});
    }
})

// change Password

routes.post('/changeStudentPassword',passport.authenticate('student',{failureRedirect:'/api/faculty/student/studentFailLogin'}),studentCtl.changeStudentPassword);

// Forget Password

routes.post('/sendMail',studentCtl.sendMail);

routes.post('/forgetStudentPassword',studentCtl.forgetStudentPassword);

// student logout

routes.get('/studentLogout',(req,res)=>{
    try{
        resolveHostname.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'something wrong', error:err})
            }
            else{
                return res.status(200).json({msg:'go to student login page'})
            }
        })
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err})
    }
}) 

module.exports = routes;