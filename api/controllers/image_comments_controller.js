const imageComments_Collection = require("../models/imageComments");
const image_Collection = require('../models/image')
const user_collection  = require('../models/user')

const Mongoose = require("mongoose");

exports.addCommentToImage=(req,res)=>{
    var imageComments = new imageComments_Collection({
        _id:new Mongoose.Types.ObjectId(),
        commentOwner:req.verified.user_auth._id,
        imageid:req.body.imageid,
        date:new Date(),
        commentText:req.body.commentText,
      });
      var error = imageComments.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        return 
      }
      imageComments.save().then(async (commentData) => {
        res.status(res.statusCode).json({
          data: commentData,
          status: res.statusCode,
          state:false
        });
      }).catch(error=>
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          })
        )
}
exports.getCommentsImage=(req,res)=>{

  imageComments_Collection.find({imageid:Mongoose.Types.ObjectId(req.body.imageid)}).populate({path:"commentOwner",select:"_id currentImageUrl userName"}).sort({date: -1}).skip(req.body.skip).limit(3).exec().then(result=>{
    res.status(res.statusCode).json({
      data:result,
      status: res.statusCode,
      state:false
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    })
  })
  
}
exports.countComments=(req,res)=>{
  imageComments_Collection.countDocuments({imageid:req.body.imageid}).exec().then(result=>{
    res.status(res.statusCode).json({
        count: result,
        status: res.statusCode,
        });
      }).catch(error=>{
        res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        });
      })
}
exports.deleteCommentFromImage=(req,res)=>{
  imageComments_Collection.findOneAndRemove({commentOwner:req.verified.user_auth._id,_id:req.body.commentid}).exec().then(result=>{
    res.status(res.statusCode).json({
      message: "comment deleted",
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
