const mongoose = require('mongoose');
const Chat = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    date:{type:Date},
    users:[{type:mongoose.Schema.Types.ObjectId, ref:'User'}],
    message:{type:String}
    
})
module.exports=mongoose.model('Chat',Chat)