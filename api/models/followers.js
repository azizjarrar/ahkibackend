const mongoose = require('mongoose');
const followers = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},//li mfollowinih
    followersid:{type:mongoose.Schema.Types.ObjectId,ref:'User'}, // id li followeh
    followersince:{type:Date},
    date:{type:Date},
    block:{type:Boolean}
})

module.exports=mongoose.model('followers',followers)
