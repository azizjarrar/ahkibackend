const imageComments_Collection = require("../models/imageComments");
const image_Collection = require('../models/image')
const user_collection = require("../models/user");

/**
 * 
    likesToImage:[{type:mongoose.Schema.Types.ObjectId,ref:'Images'}],
    likesToImageComment:[{type:mongoose.Schema.Types.ObjectId,ref:'ImageComments'}],
 */
exports.addLikeToImage=(req,res)=>{
    console.log(req.body)
    image_Collection.findOneAndUpdate({_id:req.body.imgid},{$push:{likes:req.verified.user_auth._id}}).exec().then(result=>{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$push:{likesToImage:result._id}}).then((result)=>{
            res.status(res.statusCode).json({
                message:"likes",
                status: res.statusCode,
                state:true
              });
        }).catch(e=>{
          res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        })

  }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
    })
}
exports.checklikeToImage=(req,res)=>{
    user_collection.findOne({_id:req.verified.user_auth._id,likesToImage:req.body.imgid}).exec().then((result)=>{
        if(result!=null){
          res.status(res.statusCode).json({
              status: res.statusCode,
              liked:true
            });
        }else{
          res.status(res.statusCode).json({
              status: res.statusCode,
              liked:false
            });
        }

    }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
    })
}
exports.dislikeImage=(req,res)=>{
    image_Collection.findOneAndUpdate({_id:req.body.imgid},{$pull:{likes:req.verified.user_auth._id}}).exec().then(result=>{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$likesToImage:{likes:result._id}}).then((result)=>{
            res.status(res.statusCode).json({
                message:"likes",
                status: res.statusCode,
                state:true
              });
        }).catch(e=>{
          res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        })

  }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
    })
}
exports.addLikeToCommentImage=(req,res)=>{
    imageComments_Collection.findOneAndUpdate({_id:req.body.commentid},{$push:{likes:req.verified.user_auth._id}}).exec().then(result=>{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$push:{likesToImageComment:result._id}}).then((result)=>{
            res.status(res.statusCode).json({
                message:"likes",
                status: res.statusCode,
                state:true
              });
        }).catch(e=>{
          res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        })
  
  }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
    })
}
exports.checklikeToCommentImage=(req,res)=>{
    user_collection.findOne({_id:req.verified.user_auth._id,likesToImageComment:req.body.commentid}).select("_id").exec().then((result)=>{
        if(result!=null){
          res.status(res.statusCode).json({
              status: res.statusCode,
              liked:true
            });
        }else{
          res.status(res.statusCode).json({
              status: res.statusCode,
              liked:false
            });
        }
  
    }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
    })
}
exports.dislikeToCommentImage=(req,res)=>{
    imageComments_Collection.findOneAndUpdate({_id:req.body.commentid},{$pull:{likes:req.verified.user_auth._id}}).exec().then(result=>{
      user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{likesToImageComment:result._id}}).then((result)=>{
          res.status(res.statusCode).json({
              message:"deslike",
              status: res.statusCode,
              state:true
            });
      }).catch(e=>{
        res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      });
      })

}).catch(error=>{
    res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      });
  })
}

exports.getLikestUserNameFromImage=(req,res)=>{
    image_Collection.findOne({_id:req.body.imgid}).populate({path:'likes',select: 'userName currentImageUrl'}).select("likes").exec().then(result=>{
        console.log(result)
        res.status(res.statusCode).json({
          message:"likes userName",
          data:result,
          status: res.statusCode,
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
exports.getLikestUserNameFromCommentImage=(req,res)=>{
    console.log(req.body)
    imageComments_Collection.findOne({_id:req.body.commentid}).populate({path:'likes',select: 'userName currentImageUrl'}).select("likes").exec().then(result=>{
        res.status(res.statusCode).json({
          message:"likes userName",
          data:result,
          status: res.statusCode,
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
