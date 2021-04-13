const notification_collection = require('../models/notification')
const Mongoose = require("mongoose");

exports.getnotifications=(req,res)=>{
    console.log("req.verified.user_auth._id")
    console.log(req.verified.user_auth._id)
    notification_collection.find({to:req.verified.user_auth._id}).populate({path: 'from', select: '_id currentImageUrl userName'} ).exec().then(result=>{
        res.status(res.statusCode).json({
            data:result,
            status: res.statusCode,
          });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          });
    })
}