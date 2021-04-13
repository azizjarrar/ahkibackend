const mongoose = require('mongoose');
const following = mongoose.Schema({
        _id:mongoose.Schema.Types.ObjectId,
        userid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        followingid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
        followersince:{type:Date},
        block:{type:Boolean},
        panding:{type:Boolean}
})
following.index({followingid: 1, followersince: 1}, { unique: true });
module.exports=mongoose.model('following',following)
