const user_collection = require("../models/user");
const image_collection = require("../models/image");
const Mongoose = require("mongoose");

exports.getImageData=(req,res)=>{
  image_collection.findOne({ImageOwner:req.body.userid,_id:Mongoose.Types.ObjectId(req.body.currentImgId)}).populate({path:"ImageOwner",select:"userName _id currentImageUrl"}).exec().then((async result=>{
    try{
      const prev = await image_collection.findOne({ImageOwner:req.body.userid,date:{$lt: result.date}}).sort({date:-1}).exec()
      const next = await image_collection.findOne({ImageOwner:req.body.userid,date:{$gt: result.date}}).sort({date:1}).exec()
      res.status(res.statusCode).json({
        userData:result.ImageOwner,
        currentimage:result,
        previmage:prev,
        nextimage:next,
        message: "images",
        state:true
      });
    }catch(error){
      res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
      });
    }
  })).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
    });
  })
}

exports.deleteImage=(req,res)=>{
  
  user_collection.findOne({_id:Mongoose.Types.ObjectId(req.verified.user_auth._id)}).exec().then(result=>{
    if(result!=null && result != undefined){
      if(result.currentImgId==req.body.imageid){
        if(req.body.previmage._id==null || req.body.previmage._id==undefined){
          res.status(res.statusCode).json({
            message: "you should at least have one image",
            state:true,
            status: res.statusCode,
          });
        }else{
          image_collection.findOneAndRemove({_id:req.body.imageid}).exec().then(result=>{
            user_collection.findOneAndUpdate({_id:Mongoose.Types.ObjectId(req.verified.user_auth._id)},{$set:{currentImgId:req.body.previmage._id,currentImageUrl:req.body.previmage.imageUrl}}).exec().then(result=>{
              res.status(res.statusCode).json({
                message: "image deleted",
                status: res.statusCode,
              });
            }).catch(error=>{
              res.status(res.statusCode).json({
                message: error.message,
                status: res.statusCode,
              });
            })
          }).catch(error=>{
            res.status(res.statusCode).json({
              message: error.message,
              status: res.statusCode,
            });
          })
        }
  
      }else{
        image_collection.findOneAndRemove({_id:req.body.imageid}).exec().then(result=>{
          res.status(res.statusCode).json({
            message: "image deleted",
            status: res.statusCode,
          });
        }).catch(error=>{
            res.status(res.statusCode).json({
              message: error.message,
              status: res.statusCode,
            });
        })
      }
    }else{
      res.status(res.statusCode).json({
        message: "user not found",
        status: res.statusCode,
      });
    }
  })
  //req.body.imageid
  //req.verified.user_auth._id
}

exports.getUserImages=(req,res)=>{
  image_collection.find({ImageOwner:Mongoose.Types.ObjectId(req.body.userid)}).populate({path:"ImageOwner",select:"userName _id currentImageUrl"}).exec().then(result=>{
    res.status(res.statusCode).json({
      data:result,
      message: "images",
      state:true
    });
  }).catch(error=>{
  res.status(res.statusCode).json({
    message: error.message,
    status: res.statusCode,
    state:false
  });
  })
}