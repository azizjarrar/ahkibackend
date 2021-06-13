const post_collection = require("../models/post");
const dailyTopic_collection = require("../models/dailyTopic");
const following_collection =require('../models/following')
const fs = require("fs");

const Mongoose = require("mongoose");
exports.addPost = async (req, res) => {
  var TextVideoOrImage //if true is video if false is image
  //    postVideo:{type:String,require:true},
    if(req.file!=undefined){
      TextVideoOrImage =req.file.mimetype=="video/mp4"
    }else{
      TextVideoOrImage=undefined
    }
    var post = new post_collection({
        _id: new Mongoose.Types.ObjectId(),
        OwnerOfPost:req.verified.user_auth._id,
        date:new Date(),
        Likes:0,
        postText:req.body.postText,
        postImage:req.file!=undefined && TextVideoOrImage==false?process.env.ip+req.file.path:undefined,
        postVideo:req.file!=undefined && TextVideoOrImage==true?process.env.ip+req.file.path:undefined,
        anonyme:req.body.anonyme,
        allowAnonymeComments:req.body.allowAnonymeComments
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
          post_collection.find({OwnerOfPost:req.body.userid}).populate({path:"OwnerOfPost",select:"_id currentImageUrl userName"}).sort({date: -1})
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

      post_collection.find({OwnerOfPost:{ $in: data }}).populate({path:"OwnerOfPost",select:"userName currentImageUrl"}).exec().then(result=>{
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
exports.getSelectedTopicPosts=async(req,res)=>{
  dailyTopic_collection.find({_id:req.body.idTopic}).sort({date: -1}).limit(1).exec().then(resultTodayTopic=>{

    post_collection.find({DailyTopic:resultTodayTopic[0]._id}).limit(5000).populate({path:"OwnerOfPost",select:"userName currentImageUrl"}).sort({date: -1}).exec().then((result)=>{
      newresult=result.map(data=>{
        if(data.anonyme==false){
          return Promise.resolve(data)

        }else{
          const objectComment={
            _id:data._id,
            OwnerOfPost:{
              _id:data.OwnerOfPost._id,
              userName:"anonym",
              currentImageUrl:"anonym"
            },
            postText:data.postText,
            date:data.date,
            allowAnonymeComments:data.allowAnonymeComments,
            anonyme:data.anonyme
          }
          return Promise.resolve(objectComment)
        }
      })
      Promise.all(newresult).then(newdata=>{
        res.status(res.statusCode).json({
          data: newdata,
          status: res.statusCode,
        });
      })
    }).catch(error=>{
      res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
      });
    })
  }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode
      })  
  })
}
exports.getTodayTopicPost=async (req,res)=>{
  dailyTopic_collection.find({}).sort({date: -1}).limit(1).exec().then(resultTodayTopic=>{

    post_collection.find({DailyTopic:resultTodayTopic[0]._id}).limit(5000).populate({path:"OwnerOfPost",select:"userName currentImageUrl"}).sort({date: -1}).exec().then((result)=>{
      newresult=result.map(data=>{
        if(data.anonyme==false){
          return Promise.resolve(data)

        }else{
          const objectComment={
            _id:data._id,
            OwnerOfPost:{
              _id:data.OwnerOfPost._id,
              userName:"anonym",
              currentImageUrl:"anonym"
            },
            postText:data.postText,
            date:data.date,
            allowAnonymeComments:data.allowAnonymeComments,
            anonyme:data.anonyme
          }
          return Promise.resolve(objectComment)
        }
      })
      Promise.all(newresult).then(newdata=>{
        res.status(res.statusCode).json({
          data: newdata,
          status: res.statusCode,
        });
      })
    }).catch(error=>{
      res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
      });
    })
  }).catch(error=>{
      res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode
      })  
  })

}
/************************************************/
exports.addDailyTopicPost = async (req, res) => {
    const CheckIfHeAlredyHavePostInThisTopic=await post_collection.findOne({OwnerOfPost:req.verified.user_auth._id,DailyTopic:req.body.DailyTopicid}).exec()
    if(CheckIfHeAlredyHavePostInThisTopic==null){
      var post = new post_collection({
        _id: new Mongoose.Types.ObjectId(),
        OwnerOfPost:req.verified.user_auth._id,
        date:new Date(),
        postText:req.body.postText,
        postImage:req.file!=undefined?process.env.ip+req.file.path:undefined,
        anonyme:req.body.anonyme,
        allowAnonymeComments:req.body.allowAnonymeComments,
        DailyTopic:req.body.DailyTopicid
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
    }else{
      res.status(res.statusCode).json({
        message: "already post in this topic",
        status: res.statusCode,
        state:false
      });
    }

  }
  exports.getTopUserPostsLikes=(req,res)=>{
    dailyTopic_collection.find({}).sort({date: -1}).limit(1).exec().then(resultTodayTopic=>{
      let idTopic=req.body.idTopic??resultTodayTopic[0]._id
      post_collection.find({DailyTopic:idTopic}).populate({path:"OwnerOfPost",select:"userName currentImageUrl"}).sort({Likes: -1}).limit(10).exec().then((result)=>{
       
        newresult=result.map(data=>{
          if(data.anonyme==false){
            return Promise.resolve(data)
  
          }else{
            const objectComment={
              _id:data._id,
              OwnerOfPost:{
                _id:data.OwnerOfPost._id,
                userName:"anonym",
                currentImageUrl:"anonym"
              },
              postText:data.postText,
              date:data.date,
              allowAnonymeComments:data.allowAnonymeComments,
              anonyme:data.anonyme
            }
            return Promise.resolve(objectComment)
          }
        })
        Promise.all(newresult).then(newdata=>{
          res.status(res.statusCode).json({
            data: newdata,
            message: "top  Posts",
            status: res.statusCode,
          });
        })

      }).catch(error=>{
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