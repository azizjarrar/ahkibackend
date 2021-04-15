const mongoose = require('mongoose');
const Post = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    OwnerOfPost:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    date:{type:Date,require:true},
    postText:{type:String,require:true},
    postImage:{type:String,require:true},
    anonyme:{type:String}
})

module.exports=mongoose.model('Post',Post)
