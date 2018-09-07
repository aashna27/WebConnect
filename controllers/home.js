'use strict';
const Group = require('../models/group');

module.exports = function(async,Group,_,Users){
    return {

        SetRouting: function(router){
           
            router.get('/home',this.homePage);
            //router.get('/dashboard',this.GetGroup);
            router.get('/dashboard',this.GetGroup); /*(req, res) => {
                res.render('dashboard')
            }) using ES6 */
            router.get('/logout',this.logout);


            router.post('/post', this.postHomePage);
            router.post('/dashboard',this.PostGroup);
        },

        GetGroup: function(req,res){
           return res.render('dashboard');
        },
        PostGroup: function(req,res){
            const newGroup=new Group();
            newGroup.groupName=req.body.group; 
            newGroup.save((err)=> {
                res.render('dashboard');
            })
        },

        homePage: function(req,res){ // async also has waterfall method which exec fn inside it sequentially 
            async.parallel([ // paralel makes each fn added inside it to run in parallel
               
                         function(callback){
                             Group.find({},(err,result) => {
                             callback(err,result);
                             })
                             },
                         function(callback){
                             Users.findOne({'username': req.user.username})
                                .populate('request.userId')
                                .exec((err,result) =>{

                                    callback(err,result);
                                })
                            }   
            ],(err,results) =>{
                const res1=results[0]; // results holds result from functions in parallel 
               // console.log(res1);
               const res2 = results[1];

               const dataChunk = [];
               const chunkSize = 3;

               for(let i=0; i<res1.length; i+=chunkSize){
                   dataChunk.push(res1.slice(i,i+chunkSize));
               }
                return res.render('home',{title: 'WebConnect - Home', user:req.user,chunks:dataChunk,data:res2});
            })
         
        },  


        postHomePage: function(req,res){

            async.parallel([
                function(callback){

                    Group.update({
                        '_id': req.body.id, // can also be thisreq.user.user_id
                        'members.username': {$ne: req.user.username}
                        
                    },{
                        $push: {members:{
                            username:req.user.username,
                            email: req.user.email
                        }}
                    },(err,count) =>{
                        console.log(count);
                        callback(err,count);
                    });
                }
            ], (err,results) =>{
                res.redirect('/home');
            });
        },

        logout:function(req,res){
            req.logout();
            req.session.destroy((err) =>{
                res.redirect('/');
            });


        }
    }
}

/*
// "passport": "^0.3.2", done 
   // "passport-facebook": "^2.1.1", done

   // "passport-google-oauth": "^1.0.0", done
   // "passport-local": "^1.0.0" done
    // "async": "^2.6.1", done
    */