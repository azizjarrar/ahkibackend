const mongoose = require('mongoose');
const ImageComments = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    commentOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    imageid:{type:mongoose.Schema.Types.ObjectId,ref:'Images'},
    commentText:{type:String},
    date:{type:Date,require:true},
})
module.exports=mongoose.model('ImageComments',ImageComments)