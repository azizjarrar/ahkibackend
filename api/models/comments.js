const mongoose = require('mongoose');
const Comments = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    commentText:{type:String},
    commentOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    anonym:{type:String}

})
module.exports=mongoose.model('Comments',Comments)