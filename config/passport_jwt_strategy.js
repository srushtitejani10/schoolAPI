const passport = require('passport');

const Sjwt = require('passport-jwt').Strategy;

const Ejwt = require('passport-jwt').ExtractJwt;

var opts = {
    jwtFromRequest : Ejwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : 'SchoolAPI'
}

const Admin = require('../model/adminModel');

passport.use(new Sjwt(opts, async function(payload,done){
    let checkAdminData = await Admin.findOne({email:payload.adminData.email});
    if(checkAdminData){
        return done(null, checkAdminData);
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