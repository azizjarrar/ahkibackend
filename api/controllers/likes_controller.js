const post_collection = require("../models/post");
const user_collection = require("../models/user");
const comment_collection =  require('../models/comments')
exports.addLikeToPost = async (req, res) => {
    post_collection.findOneAndUpdate({_id:req.body.postid},{$push:{likes:req.verified.user_auth._id}}).exec().then(result=>{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$push:{likes:result._id}}).then((result)=>{
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

  
  exports.checklikeToPost=(req,res)=>{
      user_collection.findOne({_id:req.verified.user_auth._id,likes:req.body.postid}).exec().then((result)=>{
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
  exports.dislikePost=(req,res)=>{
    post_collection.findOneAndUpdate({_id:req.body.postid},{$pull:{likes:req.verified.user_auth._id}}).exec().then(result=>{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{likes:result._id}}).then((result)=>{
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
  /*comments section */
  exports.dislikeToComment=(req,res)=>{
    comment_collection.findOneAndUpdate({_id:req.body.commentid},{$pull:{likes:req.verified.user_auth._id}}).exec().then(result=>{
      user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{likesToComment:result._id}}).then((result)=>{
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
  exports.addLikeToComment=(req,res)=>{
    comment_collection.findOneAndUpdate({_id:req.body.commentid},{$push:{likes:req.verified.user_auth._id}}).exec().then(result=>{
      user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$push:{likesToComment:result._id}}).then((result)=>{
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
  exports.checklikeToComment=(req,res)=>{
    user_collection.findOne({_id:req.verified.user_auth._id,likesToComment:req.body.commentid}).select("_id").exec().then((result)=>{
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
  exports.getLikestUserNameFromPost=(req,res)=>{
    console.log(req.body.postid)
    //.populate({populate:{path:'likes',select: 'userName currentImageUrl'},options:{limit:10,skip:req.body.skip }}).select("likes")
    post_collection.findOne({_id:req.body.postid}).populate({path:'likes',select: 'userName currentImageUrl'}).select("likes").exec().then(result=>{
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
exports.getLikestUserNameFromComment=(req,res)=>{
  comment_collection.findOne({_id:req.body.commentid}).populate({path:'likes',select: 'userName currentImageUrl'}).select("likes").exec().then(result=>{
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