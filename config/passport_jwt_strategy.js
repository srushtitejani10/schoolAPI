const passport = require('passport');

const Sjwt = require('passport-jwt').Strategy;

const Ejwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest : Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'SchoolAPI'
}

const Admin = require('../model/adminModel');
const Faculty = require('../model/FacultyModel');
const Student = require('../model/studentModel');

passport.use(new Sjwt(opts, async function(payload,done){
    let checkAdminData = await Admin.findOne({email:payload.adminData.email});
    if(checkAdminData){
        return done(null, checkAdminData);
    }
    else{
        return done(null, false)
    }
}))

var facultyOpts = {
    jwtFromRequest : Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'FAPI'
}

passport.use('faculty', new Sjwt(facultyOpts, async function(payload,done){
    let checkFacultyData = await Faculty.findOne({email:payload.ft.email});
    if(checkFacultyData){
        return done(null, checkFacultyData);
    }
    else{
        return done(null, false)
    }
}))

var studentOpts = {
    jwtFromRequest : Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'SAPI'
}

passport.use('student', new Sjwt(studentOpts, async function(payload,done){
    let checkStudentData = await Student.findOne({email:payload.studentData.email});
    if(checkStudentData){
        return done(null, checkStudentData);
    }
    else{
        return done(null, false)
    }
}))

passport.serializeUser((user,done)=>{
    return done(null,user.id);
})

passport.deserializeUser(async(id,done)=>{
    let AdminData = await Admin.findById(id);
    if(AdminData){
        return done(null, AdminData);
    }
    else{
        return done(null, false);
    }
})

module.exports = passport;