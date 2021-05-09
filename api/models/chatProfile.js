const mongoose = require('mongoose');
const ChatProfile = mongoose.Schema({
    LastMessage:{type:Date},
    firstUser:{type:mongoose.Schema.Types.ObjectId, ref:'User',required: true},
    secoundUser:{type:mongoose.Schema.Types.ObjectId, ref:'User',required: true}
    
    
})
ChatProfile.index({ firstUser: 1,secoundUser:1},{unique: true}); // schema level

module.exports=mongoose.model('ChatProfile',ChatProfile)