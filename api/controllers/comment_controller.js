const postNrmlTopic_collection = require("../models/postNrmlTopic");
const user_collection = require('../models/user')
const comments_collection = require('../models/comments')
const Mongoose = require("mongoose");
exports.addComment=(req,res)=>{
    var comment = new comments_collection({
        _id:new Mongoose.Types.ObjectId(),
        commentOwner:req.verified.user_auth._id,
        date:new Date(),
        commentText:req.body.commentText,
        likes:[],
        anonyme:req.body.anonyme
      });
      console.log(comment)
      var error = comment.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        return 
      }
      comment.save().then(async (result) => {
        postNrmlTopic_collection.findOneAndUpdate({_id:req.body.postid},{$push:{comments:comment._id}}).exec().then(result=>{
            res.status(res.statusCode).json({
                data: result,
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
      }).catch(error=>
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          })
        )
    }
exports.getComments=(req,res)=>{
    postNrmlTopic_collection.findOne({_id:req.body.postid}).populate({path:"comments",populate:{path:'commentOwner',select: 'userName userProfileImageUrl'},options:{ sort: {date: -1} }}).select("comments").exec().then(result=>{
        res.status(res.statusCode).json({
            data: result.comments,
            message: "post comments",
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

