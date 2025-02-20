const express = require('express');

const routes = express.Router();

const passport = require('passport')

const facultyCtl = require('../../../../controller/api/v1/facultyCtl');

// Faculty Login----Logout
routes.post('/facultyLogin',facultyCtl.facultyLogin);

routes.get('/facultyLogout',(req,res)=>{
    try{
        res.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'something wrong', error:err})
            }
            else{
                return res.status(200).json({msg:'go to faculty login page'})
            }
        })
    }
    catch(err){
        return res.status(400).json({msg:'something wrong',error:err})
    }
}) 

routes.get('/facultyFaillogin', async(req,res)=>{
    try{
        return res.status(401).json({msg:'invalid token'});
    }
    catch(err){
        return res.status(400).json({msg:'something Wrong',error:err})
    }
});

// Faculty Profile

routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyFaillogin'}),facultyCtl.facultyProfile);

routes.put('/editFacultyProfile/:id',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyFaillogin'}),facultyCtl.editFacultyProfile);

// Forget Password ------ Change Password

routes.post('/sendMail',facultyCtl.sendMail);

routes.post('/updateForgetFacultyPassword',facultyCtl.updateForgetFacultyPassword);

routes.post('/FacultyPasswordChange',passport.authenticate('faculty',{failureRedirect:'/api/faculty/facultyFaillogin'}),facultyCtl.FacultyPasswordChange);

// Student Registration

routes.post('/studentRegistration',facultyCtl.studentRegistration);

module.exports = routes;