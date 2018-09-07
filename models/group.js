const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
    groupName: {type:String,default:''},
   // image: { type:String, default:'default.png'},
    members: [{
            username: {type:String, default:''},
            email: {type:String ,default:'' }
    }]
});

module.exports = mongoose.model('Group',groupSchema);