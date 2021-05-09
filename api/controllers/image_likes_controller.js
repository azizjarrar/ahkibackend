const image_likes_collection = require('../models/imageLikes')
const image_Comments_Likes_collection = require('../models/imageCommentsLikes')
const Mongoose = require("mongoose");

exports.addLikeToImage=(req,res)=>{
  var imageLikes = new image_likes_collection({
    _id:new Mongoose.Types.ObjectId(),
    likedImage:req.body.imageid,// id mte3ek
    idOfWhoLikedImage:req.verified.user_auth._id,// id li mta3bou
    date:new Date()
  });
  var error = imageLikes.validateSync();
  if (error != undefined) {
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
    return 
  }
  imageLikes.save().then(async (imageLikes) => {
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
exports.checklikeToImage=(req,res)=>{
  image_likes_collection.findOne({likedImage:req.body.imageid,idOfWhoLikedImage:req.verified.user_auth._id}).then(async (imageLikes) => {
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
exports.dislikeImage=(req,res)=>{
  image_likes_collection.findOneAndRemove({likedImage:req.body.imageid,idOfWhoLikedImage:req.verified.user_auth._id}).then(async (imageLikes) => {
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
exports.countImageLikes=(req,res)=>{
  image_likes_collection.countDocuments({likedImage:req.body.imageid}).exec().then(result=>{
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
exports.getLikestUserNameFromImage=(req,res)=>{
  image_likes_collection.find({likedImage:req.body.imageid}).populate({path:"idOfWhoLikedImage",select: '_id currentImageUrl userName'}).then(async (imageLikes) => {
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

/*********************************
/******************************************************************/
/*******************image Comments Section****************************/
/******************************************************************/
exports.addLikeToCommentImage=(req,res)=>{
  var commentsLikes = new image_Comments_Likes_collection({
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
exports.checklikeToCommentImage=(req,res)=>{
  image_Comments_Likes_collection.findOne({likedComment:req.body.commentid,idOfWhoLikedComment:req.verified.user_auth._id}).then(async (CommentLikes) => {
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
exports.dislikeToCommentImage=(req,res)=>{
  image_Comments_Likes_collection.findOneAndRemove({likedComment:req.body.commentid,idOfWhoLikedComment:req.verified.user_auth._id}).then(async (CommentLikes) => {
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
exports.countImageCommentsLikes=(req,res)=>{
  image_Comments_Likes_collection.countDocuments({likedComment:req.body.commentid}).exec().then(result=>{
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

exports.getLikestUserNameFromCommentImage=(req,res)=>{
  image_Comments_Likes_collection.find({likedComment:req.body.commentid}).populate({path:"idOfWhoLikedComment",select: '_id currentImageUrl userName'}).then(async (CommentLikes) => {
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
