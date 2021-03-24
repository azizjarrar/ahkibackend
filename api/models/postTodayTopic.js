const mongoose = require('mongoose');
const TodayTopic = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userNameOwnerOfPost:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:'Comments'}],
    postTopic:{type:String,require:true},
    date:{type:Date,require:true},
    likes:{type:String,require:true},
    postText:{type:String,require:true},
    postImage:{type:String,require:true},
    anonyme:{type:String}
})
module.exports=mongoose.model('TodayTopic',TodayTopic)