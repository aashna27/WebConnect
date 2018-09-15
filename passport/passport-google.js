
'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');

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

passport.use(new GoogleStrategy({
     clientID: process.env.GOOGLE_CLIENT_ID,// secret.google.clientID,
     clientSecret: process.env.GOOGLE_CLIENT_SECRET, //secret.google.clientSecret,
     callbackURL: 'http://localhost:3000/auth/google/callback',
     passReqToCallback: true // allows above data to be passed in callback
 
},(req,accesstoken, refreshToken, profile ,done)=>{ // profile field has all user info if it exists 

    User.findOne({google:profile.id},(err,user)=>{
        if(err)
        {
            return done(err); // error due to connecction or server failure
        }

        if(user){ // if user data is found in db , so we return user and login 
                return done(null,user);
        }
        else{

            const newUser = new User();
            newUser.google = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.UserImage = profile._json.image.url;

            newUser.save((err)=>{
                if(err){
                    return done(err)
                }
                return done(null,newUser);
            })
        }
       
          });  
}));


