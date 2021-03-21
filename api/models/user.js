const mongoose = require('mongoose');
var today = new Date()

const User = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{type:String,require:true},
    tel:{type:String},
    idfacebook:{type:String},
    firstname:{type:String},
    lastname:{type:String},
    dialCode:{type:String},
    password:{type:String,require:true},
    biography:{type:String},
    age:{type:String,require:true},
    socketId:{type:String},
    joindate:{type:Date,default:today},
    email:{type:String},
    userProfileImageUrl:{type:String},
    verified:{type:String},
    verifiedCode:{type:String},
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    userposts:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    notification:[{type:mongoose.Schema.Types.ObjectId,ref:'notification'}],
    resetPassword:{ExpiresIn:{Type:Date},code:{Type:String}},
    changeEmail:{ExpiresIn:{Type:Date},newEmail:{Type:String},code:{Type:String}}
})
User.index({ userName: "text"}); // schema level
User.on('index', error => {
    // "_id index cannot be sparse"
    console.log(error.message);
  });
module.exports=mongoose.model('User',User)

