const mongoose = require('mongoose');
const Post = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    topic:{type:String},
    Date:{type:Date}
})
module.exports=mongoose.model('Post',Post)