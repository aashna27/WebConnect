'use strict';
const passport = require('passport');
/*  !!!!!! He has written User but idu if its for validation or Model !!!! */
module.exports = function(_,UserValidation) { // could have also included passport here by adding in container

    return {
        SetRouting : function(router){
            router.get('/',this.indexPage);
            router.get('/signup',this.getSignUp);
          //  router.get('/home',this.homePage);
            router.get('/auth/facebook',this.getFacebookLogin);
            router.get('/auth/facebook/callback',this.facebookLogin);
            router.get('/auth/google',this.getGoogleLogin);
            router.get('/auth/google/callback',this.googleLogin);
            

            //router.post('/',UserValidation.LoginValidation,this.postLogin);
            router.post('/',UserValidation.LoginValidation,this.postLogin);
            router.post('/signup',UserValidation.SignUpValidation,this.postSignup); // we use method of UserValidation file
            // using validation in post allows only validation , in order to display result from validation 
            // we modify get for the signup 
        },

        indexPage : function(req,res){
            const errors = req.flash('error');
            return res.render('index',{title: 'WebConnect | Login', messages: errors,hasErrors:errors.length >0});/*,{test: 'this is test pg'});*/
        },
        postLogin : passport.authenticate('local.login',{
            successRedirect: '/home',
            failureRedirect: '/',
            failureFlash: true
        }),

        getSignUp : function(req,res){
            const errors = req.flash('error');
            return res.render('signup',{title: 'WebConnect | SignUp', messages: errors,hasErrors:errors.length >0});
            // now we need to use bootstrap alert to display the messages
        },
        postSignup:passport.authenticate('local-signup',{
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getFacebookLogin: passport.authenticate('facebook', { 
            scope: 'email'   // specifying additional info that is needed 
        }),
        
        facebookLogin : passport.authenticate('facebook',{
            successRedirect:'/home',
            failureRedirect: '/signup',
            failureFlash: true
        }),

        getGoogleLogin: passport.authenticate('google',{
            // scope: ['profile','email'] this methods signs up user without asking for permission so we have change it 
            scope: ['https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read']

        }),
        googleLogin:passport.authenticate('google',{
            successRedirect: '/home',
            failureRedirect: '/signup',
            failureFlash: true 
        })
        ,
/*
        homePage: function(req,res){
            return res.render('home');
        }*/
    }
}