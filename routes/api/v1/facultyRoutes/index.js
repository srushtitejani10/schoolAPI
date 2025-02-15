const express = require('express');

const routes = express.Router();

const passport = require('passport')

const facultyCtl = require('../../../../controller/api/v1/facultyCtl');

routes.post('/facultyLogin',facultyCtl.facultyLogin);

routes.get('/facultyProfile',passport.authenticate('faculty',{failureRedirect:'/faculty/facultyFaillogin'}),facultyCtl.facultyProfile);

routes.get('/facultyFaillogin', async(req,res)=>{
    try{
        return res.status(401).json({msg:'invalid token'});
    }
    catch(err){
        return res.status(400).json({msg:'something Wrong',error:err})
    }
});

routes.put('/editFacultyProfile/:id',facultyCtl.editFacultyProfile);
module.exports = routes;