const mongoose = require('mongoose');
var today = new Date()
const refreshAccessToken  = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,            
    ref_token:{type:String},                            
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Creation_Time:{type:Date,default:today}
})

module.exports= mongoose.model('refreshAccessToken',refreshAccessToken)

