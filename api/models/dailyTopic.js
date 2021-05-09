const mongoose = require('mongoose');
const DailyTopic = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    topic:{type:String},
    date:{type:Date}
    
})
module.exports=mongoose.model('DailyTopic',DailyTopic)