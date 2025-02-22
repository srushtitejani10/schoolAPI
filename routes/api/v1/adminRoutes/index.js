const express = require('express');

const routes = express.Router();

const adminCtl = require('../../../../controller/api/v1/adminCtl');

const Admin = require('../../../../model/adminModel');

const passport = require('passport');

routes.post('/adminRegister',adminCtl.adminRegister);

routes.post('/adminLogin',adminCtl.adminLogin);

routes.get('/adminFaillogin', async(req,res)=>{
    try{
        return res.status(401).json({msg:'invalid token'});
    }
    catch(err){
        return res.status(400).json({msg:'something Wrong',error:err})
    }
});

routes.get('/adminProfile',passport.authenticate('jwt',{failureRedirect:'/api/adminFaillogin'}),adminCtl.adminProfile);

routes.put('/editAdminProfile/:id',passport.authenticate('jwt',{failureRedirect:'/api/adminFaillogin'}),adminCtl.editAdminProfile);

routes.get('/adminlogout',passport.authenticate('jwt',{failureRedirect:'/api/adminFaillogin'}),(req,res)=>{
    try{
        req.session.destroy((err)=>{
            if(err){
                return res.status(400).json({msg:'something wrong',error:err})
            }
            else{
                return res.status(200).json({msg:'go to admin login page'})
            }
        })
    }
    catch(err){
        console.log(err);
        return res.status(400).json({msg:'something went wrong',error:err})
    }
})

routes.post('/adminChangePassword',passport.authenticate('jwt',{failureRedirect:'/api/adminFaillogin'}),adminCtl.adminChangePassword);



routes.post('/sendMail',adminCtl.sendMail);

routes.post('/updateForgetPassword',adminCtl.updateForgetPassword);

// Faculty Registration
routes.post('/facultyRegistration',passport.authenticate('jwt',{failureRedirect:'/api/adminFaillogin'}),adminCtl.facultyRegistration);

// View Faculty Data

routes.get('/allFaculty',adminCtl.allFaculty);

module.exports = routes;