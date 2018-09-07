const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {type: String, unique: true},
    fullname: {type: String,unique:true,default:''},
    email: {type: String,unique:true},
    password: {type: String,default:''},
    userImage: {type: String,default:'default.png'},
    facebook: {type: String,default:''},
    fbTokens: Array,
    google: {type: String,default:''},
   // googleTokens: Array
   sentRequest: [{
       username: {type: String, default:''}
   }],
   request:[{
       userId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
       username: {type: String, default:''}
   }],
   friendsList: [{
       friendId: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
       friendName: {type:String , default:''}
   }],
   totalRequest: {type:Number,default:0}
} );

userSchema.methods.validUserPassword = function(password){
    return password.equals(this.password);
}

module.exports = mongoose.model('User',userSchema);