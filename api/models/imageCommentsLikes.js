const mongoose = require('mongoose');
const imageCommentsLikes = mongoose.Schema({
        _id:mongoose.Schema.Types.ObjectId,
        likedComment:{type:mongoose.Schema.Types.ObjectId,ref:'ImageComments'},// id mte3ek
        idOfWhoLikedComment:{type:mongoose.Schema.Types.ObjectId,ref:'User'},// id li mta3bou
        date:{type:Date}
})
module.exports=mongoose.model('imageCommentsLikes',imageCommentsLikes)
