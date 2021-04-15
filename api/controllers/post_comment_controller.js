const comments_collection = require('../models/postComments')
const Mongoose = require("mongoose");
exports.addComment=(req,res)=>{
  //
    var comment = new comments_collection({
        _id:new Mongoose.Types.ObjectId(),
        commentOwner:req.verified.user_auth._id,
        postid:req.body.postid,
        date:new Date(),
        commentText:req.body.commentText,
        anonyme:req.body.anonyme
      });
      var error = comment.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        return 
      }
      comment.save().then(async (commentData) => {
        res.status(res.statusCode).json({
          data: commentData,
          status: res.statusCode,
          state:false
        });
      }).catch(error=>{
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
      })
  }
exports.getComments=(req,res)=>{
  comments_collection.find({postid:Mongoose.Types.ObjectId(req.body.postid)}).populate({path:"commentOwner",select:"_id currentImageUrl userName"}).sort({date: -1}).skip(req.body.skip).limit(3).exec().then(result=>{
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

exports.deleteComment=(req,res)=>{
  console.log(req.body)
  comments_collection.findOneAndRemove({commentOwner:req.verified.user_auth._id,_id:req.body.commentid}).exec().then(result=>{
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
exports.countComments=(req,res)=>{
  comments_collection.countDocuments({postid:req.body.postid}).exec().then(result=>{
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