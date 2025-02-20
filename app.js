const express = require('express');

const port = 8080;

const app = express();

const path = require('path');

const mongoose = require('mongoose');

// const db = require('./config/db');

mongoose.connect("mongodb+srv://srushtitejani20:mMexp0i1kvLcMvnu@cluster0.m56ey.mongodb.net/schoolAPI").then((res)=>{
    console.log("DB is connected");
}).catch((err)=>{
    console.log("err");
})
const passport = require('passport');
const jwtStrategy = require('./config/passport_jwt_strategy');
const session = require('express-session');

app.use(session({
    name :'jwtsession',
    secret:'API',
    saveUninitialized: false,
    resave: false,
    cookie:{
        maxAge : 1000*60*60
    }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded());
app.use('/api', require('./routes/api/v1/adminRoutes/index'));
app.use('/api/faculty', require('./routes/api/v1/facultyRoutes'));
app.use('/api/faculty/student', require('./routes/api/v1/studentRoutes'));

app.listen(port,(err)=>{
    if(err){
        console.log(err);
        return false
    }
    console.log("server is running on port:",port);
})