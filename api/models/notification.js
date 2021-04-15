const mongoose = require('mongoose');
const notification = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    text:{type:String},
    type:{type:String},
    from:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    to:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    date:{type:Date}
})


module.exports=mongoose.model('notification',notification)
