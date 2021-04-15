const mongoose = require('mongoose');
const postlikes = mongoose.Schema({
        _id:mongoose.Schema.Types.ObjectId,
        likedPost:{type:mongoose.Schema.Types.ObjectId,ref:'Post'},// id mte3ek
        idOfWhoLikedPost:{type:mongoose.Schema.Types.ObjectId,ref:'User'},// id li mta3bou
        date:{type:Date}
})
module.exports=mongoose.model('postlikes',postlikes)
