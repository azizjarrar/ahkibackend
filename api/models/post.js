const mongoose = require('mongoose');
const Post = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userNameOwnerOfPost:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comments'}],
    date:{type:Date,require:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    postText:{type:String,require:true},
    postImage:{type:String,require:true},
    anonyme:{type:String}
})

module.exports=mongoose.model('Post',Post)
