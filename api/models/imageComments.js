const mongoose = require('mongoose');
const ImageComments = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    commentOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    commentText:{type:String},
    date:{type:Date,require:true},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
})
module.exports=mongoose.model('ImageComments',ImageComments)