const mongoose = require('mongoose');
var today = new Date()
const Images = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    imageUrl:{type:String},
    ImageOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    date:{type:Date,default:today},
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    Comments:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
})
module.exports=mongoose.model('Images',Images)