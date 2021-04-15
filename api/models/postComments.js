const mongoose = require('mongoose');
const postComments = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    commentOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    postid:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    commentText:{type:String},
    date:{type:Date,require:true},
    anonyme:{type:String}



})
module.exports=mongoose.model('postComments',postComments)