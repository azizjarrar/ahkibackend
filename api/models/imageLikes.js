const mongoose = require('mongoose');
const imagelikes = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    likedImage:{type:mongoose.Schema.Types.ObjectId,ref:'Images'},// id mte3ek
    idOfWhoLikedImage:{type:mongoose.Schema.Types.ObjectId,ref:'User'},// id li mta3bou
    date:{type:Date}
})
module.exports=mongoose.model('imagelikes',imagelikes)
