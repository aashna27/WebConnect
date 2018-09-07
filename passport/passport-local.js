
'use strict';

const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser((user,done)=>{
    done(null,user.id);

});

/* serialise method is used to determine what data will be stored in the session.
done is a callback */
// user is an object for each user in schema 

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user);
    });
});

/* deserialise method is used to get user info using data stored in session ( 'id' here) */
/*It takes ID from session and searches db findById method corresponding to ID and then 
returns the user data corresponding to the id */

/* if there are no errors err will be null and the user data is returned in 'user' object*/

passport.use('local-signup',new LocalStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true // allows above data to be passed in callback
 
},(req,email,password,done)=>{

    User.findOne( {"$or":[{'email':email},{'username':req.body.username}]}, (err, user) => {/*{'email':email},(err,user)=>{*/
        if(err)
        {
            return done(err); // error due to connecction or server failure
        }
        if(user){
            return done(null,false,req.flash('error','Username or Email already exists'));
        }

        const newUser = new User();
        newUser.username=req.body.username;
        newUser.fullname = req.body.username;
        newUser.email = req.body.email;
        newUser.password = req.body.password;

        newUser.save((err)=>{
          return  done(null,newUser);
        });
    })
}));


passport.use('local.login',new LocalStrategy({
    usernameField : 'email',
    passwordField: 'password',
    passReqToCallback: true // allows above data to be passed in callback
 
},(req,email,password,done)=>{

    User.findOne({'email':email},(err,user)=>{
        if(err){
            return done(err); // error due to connecction or server failure
        }

        const messages=[];
        if(!user || !user.validUserPassword(password)){
            messages.push('Email doesn\'t exist or Password is Invalid');
            return done(null,false,req.flash('error',messages));
        }

        return done(null,user);
    });
}));