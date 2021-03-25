const post_collection = require("../models/post");
const user_collection = require("../models/user");
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
  