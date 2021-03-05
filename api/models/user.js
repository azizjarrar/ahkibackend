const mongoose = require('mongoose');
const User = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userName:{type:String,unique:true,require:true},
    firstname:{type:String},
    lastname:{type:String},
    tel:{type:String,unique:true,require:true},
    dialCode:{type:String},
    idfacebook:{type:String,unique:true},
    email:{type:String,unique:true},
    password:{type:String,require:true},
    biography:{type:String},
    age:{type:String,require:true},
    socketId:{type:String},
    joindate:{type:Date,require:true},
    userProfileImageUrl:{type:String,require:true},
    following:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Followers:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    userposts:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'Posts'}],
    notification:[{type:mongoose.Schema.Types.ObjectId,ref:'notification'}]
})
module.exports=mongoose.model('User',User)