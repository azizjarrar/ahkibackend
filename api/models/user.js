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
    joindate:{type:Date},
    email:{type:String},
    currentImageUrl:{type:String},//this is url
    currentImgId:{type:mongoose.Schema.Types.ObjectId,ref:'Images'},
    verified:{type:String},
    verifiedCode:{type:String},

    post:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'Post'}],
    likesToComment:[{type:mongoose.Schema.Types.ObjectId,ref:'Comments'}],
    /************************* */
    likesToImage:[{type:mongoose.Schema.Types.ObjectId,ref:'Images'}],
    likesToImageComment:[{type:mongoose.Schema.Types.ObjectId,ref:'ImageComments'}],
    
    notification:[{type:mongoose.Schema.Types.ObjectId,ref:'notification'}],
    resetPassword:{ExpiresIn:{Type:Date},code:{Type:String}},
    changeEmail:{ExpiresIn:{Type:Date},newEmail:{Type:String},code:{Type:String}},
    privacy:{type:String},
    pendingFollowers:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
})
User.index({ userName: "text"}); // schema level
User.on('index', error => {
    // "_id index cannot be sparse"
    console.log(error.message);
  });
module.exports=mongoose.model('User',User)

