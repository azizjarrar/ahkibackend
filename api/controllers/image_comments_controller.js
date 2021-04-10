const imageComments_Collection = require("../models/imageComments");
const image_Collection = require('../models/image')
const user_collection  = require('../models/user')

const Mongoose = require("mongoose");

exports.addCommentToImage=(req,res)=>{
    var imageComments = new imageComments_Collection({
        _id:new Mongoose.Types.ObjectId(),
        commentOwner:req.verified.user_auth._id,
        date:new Date(),
        commentText:req.body.commentText,
        likes:[],
      });
      var error = imageComments.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: error.message,
          status: res.statusCode,
          state:false
        });
        return 
      }
      imageComments.save().then(async (commentData) => {
        image_Collection.findOneAndUpdate({_id:req.body.imageid},{$push:{comments:imageComments._id}}).exec().then(result=>{
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
exports.getCommentsImage=(req,res)=>{
    console.log(req.body)
    image_Collection.aggregate([
        {$match:{_id:Mongoose.Types.ObjectId(req.body.imageid)}},
         {$limit: 1},
         {$lookup:{
           from:'imagecomments',
           let: { commentid:"$comments"},  
    
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
             {$project: {_id:1,commentOwner:1,commentText:1,date:1,commentOwnerData:1,likes:{$size:"$likes"}}},
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
exports.deleteCommentFromImage=(req,res)=>{
  imageComments_Collection.findOneAndRemove({_id:req.body.commentid}).exec().then(resultResult=>{
    image_Collection.findOneAndUpdate({_id:req.body.imgid},{$pull:{comments:req.body.commentid}}).exec().then(result=>{
      user_collection.updateMany({_id:{$in:resultResult.likes}},{$pull:{likesToImageComment:req.body.commentid}}).exec().then((resultUser)=>{
        res.status(res.statusCode).json({
          message: "comment deleted",
          status: res.statusCode,
        });
        //ma3andimna3ml
      }).catch(error=>{
        console.log(error)
        res.status(res.statusCode).json({
          message: err.message,
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
