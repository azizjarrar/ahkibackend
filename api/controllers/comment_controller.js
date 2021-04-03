const post_collection = require("../models/post");
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
        post_collection.findOneAndUpdate({_id:req.body.postid},{$push:{comments:comment._id}}).exec().then(result=>{
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
      }).catch(error=>
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          })
        )
    }
exports.getComments=(req,res)=>{
    /*post_collection.findOne({_id:req.body.postid}).populate({path:"comments",populate:{path:'commentOwner',select: 'userName currentImageUrl'},options:{ sort: {date: -1},limit:3,skip:req.body.skip }}).select("comments").exec().then(result=>{
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
    })*/
    /**************************************************/
    post_collection.aggregate([
      {$match:{_id:Mongoose.Types.ObjectId(req.body.postid)}},
       {$limit: 1},
       {$lookup:{
         from:'comments',
         let: { commentid:"$comments",ownerId:"$commentOwner"},  
  
         pipeline : [
           { $match: { 
             $expr:  {
              $and: [
                 {$in: [ "$_id", "$$commentid" ]},
              ]
               } 
            }, 
          },
          { $sort: {date: -1}},
          { $skip: req.body.skip },
          { $limit: 3 },
          {$lookup: {
            from: "users",
            let: { ownerId: "$commentOwner" },
            pipeline : [
              { $match: { $expr: { $eq: ["$_id", "$$ownerId"] }}},
              {$project:{
                userName:1,currentImageUrl:1,_id:1
              }}],
            as: "commentOwnerData",
          }},
           {$project: {_id:1,commentOwner:1,commentText:1,date:1,anonyme:1,commentOwnerData:1,likes:{$size:"$likes"}}},
           {$sort:{date:-1}},
         ],
         as:"comments"
       }},

       {$project: {commentOwnerData:1,userName:1,currentImageUrl:1,comments:1}},


     ]).exec().then(result=>{
       res.status(res.statusCode).json({
           data: result[0].comments,
           message: "post comments",
           status: res.statusCode,
         });
   }).catch(error=>{
      console.log(error)
       res.status(res.statusCode).json({
           message: error.message,
           status: res.statusCode,
           state:false
         });
   })
}

