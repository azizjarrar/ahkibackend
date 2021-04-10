const user_collection = require("../models/user");
const image_collection = require("../models/image");
const Mongoose = require("mongoose");

exports.getImageData=(req,res)=>{
    user_collection.aggregate([
       {$match:{_id:Mongoose.Types.ObjectId(req.body.userid)}},
       {$limit: 1},
       {$project: {userProfileImagesUrl:1,userName:1,_id:1,currentImageUrl:1}},
       {$lookup: {
        from: "images",
        let: { userProfileImagesUrlArray: "$userProfileImagesUrl" },    
        pipeline : [
            { $match: { $expr: { $eq: [ "$_id", Mongoose.Types.ObjectId(req.body.currentImgId) ] } }, },
            { "$project": { likes: {$size:"$likes"}, imageText:1,Comments: {$size:"$comments"} ,ImageOwner:1,imageUrl:1,date:1}},

        ],
        as: "images"
        }},
        {$project: {images:1,imageText:1,userProfileImagesUrl:1,userName:1,_id:1,currentImageUrl:1,ImageOwner:1}},

     ]).exec().then(async result=>{
         const prev= await user_collection.findOne({_id: Mongoose.Types.ObjectId(req.body.userid)})
         .populate({path:"userProfileImagesUrl",match: {date:{$lt: result[0].images[0].date}},select:'_id',options: {sort: {date: -1},limit: 1}
         }).select("userProfileImagesUrl").exec()
         const next=await user_collection.findOne({_id: Mongoose.Types.ObjectId(req.body.userid)})
         .populate({path:"userProfileImagesUrl",match: {date:{$gt: result[0].images[0].date}},select:'_id',options: {sort: {date: 1},limit: 1}})
         .select("userProfileImagesUrl").exec()

         res.status(res.statusCode).json({
            userData:{_id:result[0]._id,userName:result[0].userName,currentImageUrl:result[0].currentImageUrl},
            currentimage:result[0].images[0],
            previmage:prev,
            nextimage:next,
            message: "images",
            state:true
          });
     }).catch(error=>{
         console.log(error)
     })
}

exports.deleteImage=(req,res)=>{
  user_collection.findOne({_id:req.verified.user_auth._id}).exec().then( async result=>{
    if(result!= null){
      console.log("/***********************************************/")
      console.log(result.userProfileImagesUrl)
      if(result.currentImgId==req.body.imageid){
        if(result.userProfileImagesUrl.length==1){
          res.status(res.statusCode).json({
            message: "you should at least have one image",
            state:true,
            status: res.statusCode,
          });
        }else{
         const imagedata = await image_collection.findOne({_id:result.userProfileImagesUrl[result.userProfileImagesUrl.length-2]}).exec()
          user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{userProfileImagesUrl:req.body.imageid},$set:{currentImgId:result.userProfileImagesUrl[result.userProfileImagesUrl.length-2],currentImageUrl:imagedata.imageUrl}}).exec().then(()=>{
            image_collection.findOneAndRemove({_id:req.body.imageid,ImageOwner:req.verified.user_auth._id}).exec().then((result=>{
              if(result==null){
                res.status(res.statusCode).json({
                  message: "access denied for user",
                  status: res.statusCode,
                });
              }else{
                user_collection.updateMany({_id:{$in:result.likes}},{$pull:{likesToImage:req.body.imageid}}).exec().then((res)=>{
                  //ma3andimna3ml
                }).catch(e=>{
                  res.status(res.statusCode).json({
                    message: err.message,
                    status: res.statusCode,
                  });        
                })
              if(result.postImage!=undefined){
                try {
                  fs.unlinkSync(result.imageUrl.slice(result.imageUrl.indexOf("uploads"),455));
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
              message: error.message,
              status: res.statusCode,
            });
          })
        }

      }else{
        user_collection.findOneAndUpdate({_id:req.verified.user_auth._id},{$pull:{userProfileImagesUrl:req.body.imageid}}).exec().then(()=>{
          image_collection.findOneAndRemove({_id:req.body.imageid,ImageOwner:req.verified.user_auth._id}).exec().then((result=>{
            if(result==null){
              res.status(res.statusCode).json({
                message: "access denied for user",
                status: res.statusCode,
              });
            }else{
              user_collection.updateMany({_id:{$in:result.likes}},{$pull:{likesToImage:req.body.imageid}}).exec().then((res)=>{
                //ma3andimna3ml
              }).catch(e=>{
                res.status(res.statusCode).json({
                  message: err.message,
                  status: res.statusCode,
                });        
              })
            if(result.postImage!=undefined){
              try {
                fs.unlinkSync(result.imageUrl.slice(result.imageUrl.indexOf("uploads"),455));
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
            message: error.message,
            status: res.statusCode,
          });
        })
      }
    }else{
      res.status(res.statusCode).json({
        message: "user not found",
        status: res.statusCode,
      });
    }
  





  })

}