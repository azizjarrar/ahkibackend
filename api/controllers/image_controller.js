const user_collection = require("../models/user");
const Mongoose = require("mongoose");
/*
   {$lookup: {
        from: "images",
        let: { OneElemetOfArray: "$userProfileImagesUrl" },    
        pipeline : [
            { $match: { $expr: { $eq: [ req.body.currentImgId, "$$OneElemetOfArray" ] } }, },
        ],
        as: "images"
        }},
        {$project: {images:1}}, */
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
            { "$project": { likes: {$size:"$likes"}, imageText:1,Comments: {$size:"$Comments"} ,ImageOwner:1,imageUrl:1,date:1}},

        ],
        as: "images"
        }},
        {$project: {images:1,imageText:1,userProfileImagesUrl:1,userName:1,_id:1,currentImageUrl:1}},

     ]).exec().then(async result=>{
        console.log(result[0].images)
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
   /* user_collection.findOne({_id: Mongoose.Types.ObjectId(req.body.userid)}).populate({path:"userProfileImagesUrl",match: {_id:req.body.currentImgId},select:'_id imageUrl date'}).select("userProfileImagesUrl").exec().then(async result=>{




        const prev= await user_collection.findOne({_id: Mongoose.Types.ObjectId(req.body.userid)})
        .populate({path:"userProfileImagesUrl",match: {date:{$lt: result.userProfileImagesUrl[0].date}},select:'_id',options: {sort: {date: -1},limit: 1}
        }).select("userProfileImagesUrl").exec()
        const next=await user_collection.findOne({_id: Mongoose.Types.ObjectId(req.body.userid)})
        .populate({path:"userProfileImagesUrl",match: {date:{$gt: result.userProfileImagesUrl[0].date}},select:'_id',options: {sort: {date: 1},limit: 1}})
        .select("userProfileImagesUrl").exec()
        res.status(res.statusCode).json({
          currentimage:result.userProfileImagesUrl[0],
          previmage:prev,
          nextimage:next,
          message: "images",
          state:true
        });
      }).catch(error=>{
    res.status(res.statusCode).json({
      message: error.message,
      status: res.statusCode,
      state:false
    });
  })*/
}
/**
 *             $project:
               {
                 index: { $indexOfArray: [ "$userProfileImagesUrl", 2 ] },
               }
 */
