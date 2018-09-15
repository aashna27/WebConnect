'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
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

passport.use(new FacebookStrategy({
     clientID:secret.facebook.clientID,
     clientSecret: secret.facebook.clientSecret,
     profileFields: secret.facebook.profileFields,
     callbackURL:secret.facebook.callbackURL,
     passReqToCallback: true // allows above data to be passed in callback
 
},(req,token, refreshToken, profile ,done)=>{ // profile field has all user info if it exists 

    User.findOne({facebook:profile.id},(err,user)=>{
        if(err)
        {
            return done(err); // error due to connecction or server failure
        }
        if(user){
            return done(null,user); // if user exists in db then login the user 
        }
        else{
            const newUser = new User();
            newUser.facebook = profile.id;
            newUser.fullname = profile.displayName;
            newUser.username = profile.displayName;
            newUser.email = profile._json.email;
            newUser.userImage = 'https://graph.facebook.com/'+profile.id+'picture?type=large';
            newUser.fbTokens.push({token:token});

            newUser.save((err)=> {
                return done(null, user);
             });

          }});  
}));
