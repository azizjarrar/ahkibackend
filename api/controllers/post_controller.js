const post_collection = require("../models/post");
const user_collection = require("../models/user");
const following_collection =require('../models/following')
const fs = require("fs");

const Mongoose = require("mongoose");
exports.addPost = async (req, res) => {
    var post = new post_collection({
        _id: new Mongoose.Types.ObjectId(),
        OwnerOfPost:req.verified.user_auth._id,
        date:new Date(),
        postText:req.body.postText,
        postImage:req.file!=undefined?process.env.ip+req.file.path:undefined,
        anonyme:req.body.anonyme
      });
    
      var error = post.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: "invalid post",
          status: res.statusCode,
          state:false
        });
        return 
      }
      post.save().then(async (result) => {
        res.status(res.statusCode).json({
          data: result,
          message: "post  is online",
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
exports.getCurrentUserPosts = async (req, res) => { 
       post_collection.find({OwnerOfPost:req.verified.user_auth._id}).populate({path:"OwnerOfPost",select:"_id currentImageUrl userName"}).sort({date: -1})
       .exec()
       .then(result=>{

        res.status(res.statusCode).json({
            data: result,
            message: "post was  posts",
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
exports.getOtherUserPosts = async (req, res) => {
          post_collection.find({OwnerOfPost:req.body.userid}).populate({path:"OwnerOfPost",select:"_id currentImageUrl userName"})
          .exec()
          .then(result=>{
          res.status(res.statusCode).json({
            data: result,
            message: "user posts",
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

exports.deletePost=(req,res)=>{
  post_collection.findOneAndRemove({_id:req.body.postid,OwnerOfPost:req.verified.user_auth._id}).exec().then(result=>{
    res.status(res.statusCode).json({
      data: result,
      message: "post was deleted",
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
exports.getFriendsPosts=async (req,res)=>{
  following_collection.find({userid:req.verified.user_auth._id}).limit(5000).select("followingid").exec().then((result)=>{
    let newarray=result.map(e=>{
      return Promise.resolve(e.followingid)
    })

    Promise.all(newarray).then(data=>{
      console.log(data)

      post_collection.find({OwnerOfPost:{ $in: data }}).populate({path:"OwnerOfPost",select:"userName currentImageUrl"}).exec().then(result=>{
        console.log(result)
        res.status(res.statusCode).json({
          data: result,
          status: res.statusCode,
        });
    })
    })


  }).catch(error=>{
    res.status(res.statusCode).json({
      message: err.message,
      status: res.statusCode,
    });
  })

}