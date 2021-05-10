const mongoose = require('mongoose');
const Chat = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    date:{type:Date},
    users:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    sender:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    reciver:{type:mongoose.Schema.Types.ObjectId, ref:'User'},
    message:{type:String},
    seen:{type:Boolean}
    
})
module.exports=mongoose.model('Chat',Chat)