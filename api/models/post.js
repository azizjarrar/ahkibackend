const mongoose = require('mongoose');
const Post = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    OwnerOfPost:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    date:{type:Date,require:true},
    postText:{type:String,require:true},
    postImage:{type:String,require:true},
    postVideo:{type:String,require:true},
    anonyme:{type:Boolean},
    allowAnonymeComments:{type:Boolean},
    DailyTopic:{type:mongoose.Schema.Types.ObjectId,ref:'DailyTopic'}
})

module.exports=mongoose.model('Post',Post)
