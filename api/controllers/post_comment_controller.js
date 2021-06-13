const comments_collection = require('../models/postComments')
const Mongoose = require("mongoose");
exports.addComment=async (req,res)=>{
  //
    if(req.body.anonyme==true){
      const checkIfUserAlreadyDidAnonymCommentOnPost=await comments_collection.findOne({commentOwner:req.verified.user_auth._id,postid:req.body.postid,anonyme:true}).exec()
      if(checkIfUserAlreadyDidAnonymCommentOnPost==null){
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
      }else{
        console.log("error")
        res.status(res.statusCode).json({
          message: "you have already anonym comment",
          status: res.statusCode,
          state:false
        });
      }
    }else{
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

  }
exports.getComments=(req,res)=>{
  comments_collection.find({postid:Mongoose.Types.ObjectId(req.body.postid)}).populate({path:"postid",select:"allowAnonymeComments"}).populate({path:"commentOwner",select:"_id currentImageUrl userName"}).sort({date: -1}).skip(req.body.skip).limit(3).exec().then(result=>{

    const newCommentsArray=result.map(async (data)=>{
      if(data.postid.allowAnonymeComments==true && data.anonyme==true){
        const objectComment={
          _id:data._id,
          commentOwner:{
            _id:data.commentOwner._id,
            userName:"anonym",
            currentImageUrl:"anonym"
          },
          postid:data.postid,
          date:data.date,
          commentText:data.commentText,
          anonyme:data.anonyme
        }

        return Promise.resolve(objectComment)
      }else{

        return Promise.resolve(data)

      }
        //return anAsyncmap({...data})
    })
    Promise.all(newCommentsArray).then(newdataArray=>{
      res.status(res.statusCode).json({
        data:newdataArray,
        status: res.statusCode,
        state:false
      });
    })

  }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    })
  })
}

exports.deleteComment=(req,res)=>{
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