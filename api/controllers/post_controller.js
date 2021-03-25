const post_collection = require("../models/post");
const user_collection = require("../models/user");
const fs = require("fs");

const Mongoose = require("mongoose");
exports.addPost = async (req, res) => {
    var post = new post_collection({
        _id: new Mongoose.Types.ObjectId(),
        userNameOwnerOfPost:req.verified.user_auth._id,
        comments:[],
        date:new Date(),
        likes:[],
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
        user_collection.findByIdAndUpdate({_id:req.verified.user_auth._id},{$push:{post:result._id}}).exec().then(result=>{
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

      })
    }
exports.getCurrentUserPosts = async (req, res) => { 
       user_collection.aggregate([
         {$match:{_id:Mongoose.Types.ObjectId(req.verified.user_auth._id)}},
        {$limit: 1},
        {$lookup:{
          from:'posts',
          let: { postid:"$post"},    
          pipeline : [
            { $match: { $expr: { $in: [ "$_id", "$$postid" ] } }, },
            {$project: {_id:1,userNameOwnerOfPost:1,postImage:1,date:1,postText:1,anonyme:1,comments:{$size:"$comments"},likes:{$size:"$likes"}}},
            {$sort:{date:-1}},
          ],
          as:"posts"
        }},
        {$project: {posts:1}},

      ]).exec().then(result=>{
        res.status(res.statusCode).json({
            data: result[0].posts,
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
exports.getOtherUserPosts = async (req, res) => {

    user_collection.aggregate([
    {$match:{ $and:[{_id:Mongoose.Types.ObjectId(req.body.userid)}]}},
     {$limit: 1},
     {$lookup:{
       from:'posts',
       let: { postid:"$post"},    
       pipeline : [
         { $match: { 
           $expr:  {
            $and: [
               {$in: [ "$_id", "$$postid" ]},
              { $eq: ['$anonyme', 'false'] }
            ]
             } 
           
          }, },
         {$project: {_id:1,postImage:1,userNameOwnerOfPost:1,date:1,postText:1,anonyme:1,comments:{$size:"$comments"},likes:{$size:"$likes"}}},
         {$sort:{date:-1}},
       ],

       as:"posts"
     }},
     {$project: {userName:1,userProfileImageUrl:1,posts:1}},

   ]).exec().then(result=>{
     res.status(res.statusCode).json({
         data: result[0].posts,
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
  user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{post:req.body.postid}}).exec().then(()=>{
    post_collection.findOneAndRemove({_id:req.body.postid,userNameOwnerOfPost:req.verified.user_auth._id}).exec().then((result=>{
      if(result==null){
        res.status(res.statusCode).json({
          message: "access denied for user",
          status: res.statusCode,
        });
      }else{
        user_collection.updateMany({_id:{$in:result.likes}},{$pull:{likes:req.body.postid}}).exec().then((res)=>{
          //ma3andimna3ml
        }).catch(e=>{
          res.status(res.statusCode).json({
            message: err.message,
            status: res.statusCode,
          });        
        })
      if(result.postImage!=undefined){

        
        try {
          fs.unlinkSync(result.postImage.slice(result.postImage.indexOf("uploads"),455));
          res.status(res.statusCode).json({
            message: "post was deleted",
            status: res.statusCode,
          });
        } catch (err) {

          console.log(err)
          res.status(res.statusCode).json({
            message: err.message,
            status: res.statusCode,
          });
      
        }
      }else{
        
        res.status(res.statusCode).json({
          message: "post was deleted",
          status: res.statusCode,
        });
      }
    }
    }))
  }).catch(error=>{
    res.status(res.statusCode).json({
      message: err.message,
      status: res.statusCode,
    });
  })
}