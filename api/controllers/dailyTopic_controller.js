const dailyTopic_collection = require("../models/dailyTopic");
const Mongoose = require("mongoose");

exports.Addtopic=(req,res)=>{
    var today = new Date()
    dailyTopic = new dailyTopic_collection({
        _id: new Mongoose.Types.ObjectId(),
        topic:req.body.topic,
        date:today
    })
    var error = dailyTopic.validateSync();
    if (error != undefined) {
      res.status(res.statusCode).json({
        message: "invalid Topic",
        status: res.statusCode,
        state:false
      });
      return 
    }
    dailyTopic.save().then(result=>{
        res.status(res.statusCode).json({
            message: "topic was added",
            status: res.statusCode
        })  
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}
exports.getLastTopic=(req,res)=>{
    dailyTopic_collection.find({}).sort({date: -1}).limit(1).exec().then(result=>{
        res.status(res.statusCode).json({
            message: "today topic",
            data:result,
            status: res.statusCode
        }) 
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}
exports.getSpecificTopic=(req,res)=>{
    dailyTopic_collection.find({_id:req.body.idTopic}).limit(1).exec().then(result=>{
        res.status(res.statusCode).json({
            message: "selected topic",
            data:result,
            status: res.statusCode
        }) 
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}

exports.getallTopics=(req,res)=>{
    dailyTopic_collection.find({}).sort({date: -1}).limit(20).exec().then(result=>{
        res.status(res.statusCode).json({
            message: "today topic",
            data:result,
            status: res.statusCode
        }) 
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}