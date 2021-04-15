const mongoose = require('mongoose');
const Images = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    imageUrl:{type:String},
    ImageOwner:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    imageText:{type:String},
    date:{type:Date},
})
module.exports=mongoose.model('Images',Images)