const post_likes_collection = require("../models/postLikes");
const post_Comments_Likes_collection = require('../models/postCommentsLikes')
const post_collection = require("../models/post");

const Mongoose = require("mongoose");

exports.addLikeToPost = async (req, res) => {
  var postLikes = new post_likes_collection({
    _id:new Mongoose.Types.ObjectId(),
    likedPost:req.body.postid,// id mte3ek
    idOfWhoLikedPost:req.verified.user_auth._id,// id li mta3bou
    date:new Date()
  });
  var error = postLikes.validateSync();
  if (error != undefined) {
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
    return 
  }

  //Likes
  post_collection.findOneAndUpdate({_id:req.body.postid},{$inc:{Likes:1}}).exec().then(()=>{
    postLikes.save().then(async (postLikes) => {
      res.status(res.statusCode).json({
        data: postLikes,
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
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    })
  })


}
exports.checklikeToPost=(req,res)=>{
    post_likes_collection.findOne({likedPost:req.body.postid,idOfWhoLikedPost:req.verified.user_auth._id}).then((postLikes) => {
      res.status(res.statusCode).json({
        data: postLikes,
        status: res.statusCode,
        state:false
      });
    }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        })
      }
    )


}
exports.dislikePost=(req,res)=>{
  post_collection.findOneAndUpdate({_id:req.body.postid},{$inc:{Likes:-1}}).exec().then(()=>{
    post_likes_collection.findOneAndRemove({likedPost:req.body.postid,idOfWhoLikedPost:req.verified.user_auth._id}).then(async (postLikes) => {
      res.status(res.statusCode).json({
        data: imageLikes,
        status: res.statusCode,
        state:false
      });
    }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        })
      }
    )

  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    })
  })


}
exports.countPostLikes=(req,res)=>{
  post_likes_collection.countDocuments({likedPost:req.body.postid}).exec().then(result=>{
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
exports.getLikestUserNameFromPost=(req,res)=>{

  post_likes_collection.find({likedPost:req.body.postid}).populate({path:"idOfWhoLikedPost",select: '_id currentImageUrl userName'}).then(async (imageLikes) => {
    res.status(res.statusCode).json({
      data: imageLikes,
      status: res.statusCode,
      state:false
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      })
    }
  )
}
/******************************************************************/
/*******************post Comments Section****************************/
/******************************************************************/
exports.addLikeToComment=(req,res)=>{
  var commentsLikes = new post_Comments_Likes_collection({
    _id:new Mongoose.Types.ObjectId(),
    likedComment:req.body.commentid,// id mte3ek
    idOfWhoLikedComment:req.verified.user_auth._id,// id li mta3bou
    date:new Date()
  });
  var error = commentsLikes.validateSync();
  if (error != undefined) {
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
    return 
  }
  commentsLikes.save().then(async (imageLikes) => {
    res.status(res.statusCode).json({
      data: imageLikes,
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
exports.checklikeToComment=(req,res)=>{
  post_Comments_Likes_collection.findOne({likedComment:req.body.commentid,idOfWhoLikedComment:req.verified.user_auth._id}).then(async (CommentLikes) => {
    res.status(res.statusCode).json({
      data: CommentLikes,
      status: res.statusCode,
      state:false
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      })
    }
  )
}

exports.dislikeToComment=(req,res)=>{
  post_Comments_Likes_collection.findOneAndRemove({likedComment:req.body.commentid,idOfWhoLikedComment:req.verified.user_auth._id}).then(async (CommentLikes) => {
    res.status(res.statusCode).json({
      data: CommentLikes,
      status: res.statusCode,
      state:false
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      })
    }
  )
}
exports.countPostCommentsLikes=(req,res)=>{
  post_Comments_Likes_collection.countDocuments({likedComment:req.body.commentid}).exec().then(result=>{
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
exports.getLikestUserNameFromComment=(req,res)=>{

  post_Comments_Likes_collection.find({likedComment:req.body.commentid}).populate({path:"idOfWhoLikedComment",select: '_id currentImageUrl userName'}).then(async (CommentLikes) => {
    res.status(res.statusCode).json({
      data: CommentLikes,
      status: res.statusCode,
      state:false
    });
  }).catch(error=>{
    res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        state:false
      })
    }
  )
}
//postid
//commentid