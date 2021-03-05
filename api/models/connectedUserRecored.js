const mongoose = require('mongoose');
const ConnectedUserRecored = mongoose.Schema({
    userName:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    ip:{type:String},
    time:{Type:Date}
})
module.exports=mongoose.model('ConnectedUserRecored',ConnectedUserRecored)