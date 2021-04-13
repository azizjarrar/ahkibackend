const mongoose = require('mongoose');
const followers = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    followingid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    followersince:{type:Date},
    block:{type:Boolean}
})

module.exports=mongoose.model('followers',followers)
