'use strict';
/* Since /helpers is in container.js file so we can directly use the methods of this file by specifying its name */
/* So we use this file in the routing file(users.js) , to use validation by specifying name of this file in the function */

module.exports = function(){ // server side validation using express validator
    return{ 
        
        LoginValidation: (req,res,next)=>{
            req.checkBody('email','Email is required').notEmpty();
            req.checkBody('email','Email is Invalid').isEmail();

            req.checkBody('password','Password is required').notEmpty();
            req.checkBody('password','Password Must Not Be Less Than 5').isLength({min:5});
           
            req.getValidationResult() // getValidationResult returns a promise therefore we using then and catch methods 
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                    
                    req.flash('error',messages);
                    res.redirect('/');
                                           
                    
                })
                .catch((err) => {
                    console.log("Error", err)
                    
                   return next(); //this is
                });
          },
        SignUpValidation: (req,res,next)=>{
            req.checkBody('username','Username is required').notEmpty();

            req.checkBody('email','Email is required').notEmpty();
            req.checkBody('email','Email is Invalid').isEmail();

            req.checkBody('password','Password is required').notEmpty();
            req.checkBody('password','Password Must Not Be Less Than 5').isLength({min:5});
           
            req.getValidationResult() // getValidationResult returns a promise 
                .then((result) => {
                    const errors = result.array();
                    const messages = [];
                    errors.forEach((error) => {
                        messages.push(error.msg);
                    });
                   
                    req.flash('error',messages);
                    res.redirect('/signup');                       
                    
                })
                .catch((err) => {
                    return next();
                });
          },
 
    }
}



// try to implement client side validation using js 