const mongoose = require('mongoose');
const postCommentsLikes = mongoose.Schema({
        _id:mongoose.Schema.Types.ObjectId,
        likedComment:{type:mongoose.Schema.Types.ObjectId,ref:'postComments'},// id mte3ek
        idOfWhoLikedComment:{type:mongoose.Schema.Types.ObjectId,ref:'User'},// id li mta3bou
        date:{type:Date}
})
module.exports=mongoose.model('postCommentsLikes',postCommentsLikes)
