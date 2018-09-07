module.exports = function(Users,async){ // importing user model 
    return {
        SetRouting: function(router){
            router.get('/group/:groupName',this.groupPage);
            router.post('/group/:groupName',this.groupPostPage);
            router.get('/logout',this.logout);

        },
        groupPage: function(req,res){
            const gname = req.params.groupName; // to get groupName parameter from url 
            
            async.parallel([
              
                function(callback){
                    Users.findOne({'username': req.user.username})
                    .populate('request.userId')
                    .exec((err,result) =>{
                        callback(err,result);
                    })
                }   
            ],  (err,results) => {

                const result1 = results[0];
                console.log(result1);

                res.render('groupchat/group',{title: 'Webconnect- Group', user:req.user,gname:gname,data: result1}); // {} we have passed in the object to be used in ejs
             });
        },
        groupPostPage: function(req,res){

            async.parallel([
                  /* functions are for sending friend request */
                function(callback){
                    if(req.body.receiverName){
                        Users.update({
                            'username':req.body.receiverName,
                            'request.userId': {$ne: req.user._id},
                            'friendsList.friendId': {$ne: req.user._id}
                        },
                        {
                                $push: {request: {
                                    userId: req.user._id,
                                    username: req.user.username
                                }},
                                $inc: {totalRequest: 1}
                        } , (err,count) =>{
                            callback(err,count);
                        })
                    }
                 }, 

                 function(callback){
                     if(req.body.receiverName){
                         Users.update({
                             'username': req.user.username,
                             'sentRequest.username': {$ne: req.body.receiverName}
                         },
                        {
                             $push: { sentRequest:{
                                 username:req.body.receiverName
                             }}
                        }, (err,count) => {
                            callback(err, count);
                        })
                     }
                 }

            ], (err, results) => {
                    res.redirect('/group/'+req.params.groupName);
            });


/* ----------functions inside this will be for accepting or cancelling request ---------- */
            async.parallel([
                 // ---------- ACCEPTING REQUEST  FUNCTIONS ------------
                function(callback){ 
                    // this fn is for updating friendsList for receiver < -----RECEIVER ---------
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.user._id, // -> get the receiver obj from db and update in it 
                            'friendsList.friendId': {$ne: req.body.senderId}
                        }, {
                            $push: {friendsList:{
                                friendId: req.body.senderId,
                                friendName: req.body.senderName
                            }},
                             $inc: {totalRequest: -1},
                             $pull: {request:{
                                userId: req.body.senderId,
                                username: req.body.senderName 
                             }},
                        } , (err,count) => {
                            callback(err,count);
                        });
 
                    }
                },

                function(callback){ 
                    // this fn is for updating Database of sender 
                    if(req.body.senderId){
                        Users.update({
                            '_id': req.body.senderId, // -> get the receiver obj from db and update in it 
                            'friendsList.friendId': {$ne: req.user._id} // req.user._id this we get once receiver is logged in 
                        }, {
                            $push: {friendsList:{
                                friendId: req.user._id,
                                friendName: req.user.username  // avl as rcvr is logged in
                            }},
                            $pull: {sentRequest:{
                                username: req.user.username 
                             }},
                        } , (err,count) => {
                            callback(err,count);
                        });

                    }
                },
                // ---------- CANCELLING REQEUST FUNCTIONS ------------
                function(callback){
                    // --- receiver ---
                    if(req.body.user_Id){
                            Users.update({
                                '_id': req.user._id,
                                'request.userId': {$eq: req.body.user_Id}

                            }, {
                                $pull: {request:{
                                    userId: req.body.user_Id,
                                }},
                                $inc: {totalRequest: -1}
                            }, (err,count) => {
                                callback(err,count);
                            });
                    }
                },

                function(callback){
                    // ------ Sender ------
                    if(req.body.user_Id){
                        Users.update({
                            '_id':req.body.user_Id,
                            'sentRequest.username': {$eq: req.user.username}
                        }, {
                            $pull: {sentRequest:{
                                username: req.user.username 
                            }}
                        }, (err,count) => {
                            callback(err,count);
                        });
                    }
                }

            ], (err, results) => {
                res.redirect('/group/'+req.params.groupName);
            });
        },
        logout:function(req,res){
            req.logout();
            res.session.destroy((err) =>{
                res.redirect('/');
            });
        }
    }
}