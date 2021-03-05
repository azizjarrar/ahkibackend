const mongoose = require('mongoose');
var today = new Date()

const User = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{type:String,unique:true,require:true},
    tel:{type:String,unique:true,require:true},
    idfacebook:{type:String,unique:true},
    firstname:{type:String},
    lastname:{type:String},
    dialCode:{type:String},
    password:{type:String,require:true},
    biography:{type:String},
    age:{type:String,require:true},
    socketId:{type:String,default:today},
    joindate:{type:Date,require:true},
    userProfileImageUrl:{type:String},
    following:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    followers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    userposts:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    notification:[{type:mongoose.Schema.Types.ObjectId,ref:'notification'}]
})
module.exports=mongoose.model('User',User)