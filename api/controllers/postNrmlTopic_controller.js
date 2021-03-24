const postNrmlTopic_collection = require("../models/postNrmlTopic");
const user_collection = require("../models/user");
const Mongoose = require("mongoose");
exports.addPost = async (req, res) => {
    console.log(req.body)
    var postNrmlTopic = new postNrmlTopic_collection({
        _id: new Mongoose.Types.ObjectId(),
        userNameOwnerOfPost:req.verified.user_auth._id,
        comments:[],
        date:new Date(),
        likes:[],
        postText:req.body.postText,
        postImage:req.file!=undefined?process.env.ip+req.file.path:undefined,
        anonyme:req.body.anonyme
      });
    
      var error = postNrmlTopic.validateSync();
      if (error != undefined) {
        res.status(res.statusCode).json({
          message: "invalid post",
          status: res.statusCode,
          state:false
        });
        return 
      }
      postNrmlTopic.save().then(async (result) => {
        user_collection.findByIdAndUpdate({_id:req.verified.user_auth._id},{$push:{nrmlTopic:result._id}}).exec().then(result=>{
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
  /*  user_collection.findOne({_id:req.verified.user_auth._id}).populate({path:"nrmlTopic",options:{ sort: {date: -1} }}).select("nrmlTopic comments likes").exec().then(result=>{
        res.status(res.statusCode).json({
            
            data: result.nrmlTopic,
            message: "user posts",
            status: res.statusCode,
          });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          });
    })*///{ "$unwind": "$nrmlTopic" }
       // user_collection.aggregate([{$match:{_id:Mongoose.Types.ObjectId(req.verified.user_auth._id)}},{$lookup:{from:{from:"nrmlTopic",localField:"",foreignField:""}}},{$sort: {date: -1}}]).exec().then(result=>{
       //        { "$unwind": "$posts" },{ "$group": {"_id": "$_id","nrmlTopic": { "$push": "$nrmlTopic" },"posts": { "$push": "$posts" }}} 
       user_collection.aggregate([
         {$match:{_id:Mongoose.Types.ObjectId(req.verified.user_auth._id)}},
        {$limit: 1},
        {$project: {nrmlTopic:1}},
        {$lookup:{
          from:'nrmltopics',
          let: { topicId:"$nrmlTopic"},    
          pipeline : [
            { $match: { $expr: { $in: [ "$_id", "$$topicId" ] } }, },
            {$project: {_id:1,userNameOwnerOfPost:1,date:1,postText:1,anonyme:1,comments:{$size:"$comments"},likes:{$size:"$likes"}}}
          ],
          as:"posts"
        }},
      ]).exec().then(result=>{
        res.status(res.statusCode).json({
            data: result[0].posts,
            message: "user posts",
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
exports.getOtherUserPosts = async (req, res) => {
    /*console.log(req.body.userid)
    user_collection.findOne({_id:req.body.userid}).populate({path:"nrmlTopic",match:{anonyme:false},populate:{path:'userNameOwnerOfPost',select: 'userName userProfileImageUrl'},options:{ sort: {date: -1} }}).exec().then(result=>{
    //user_collection.findOne({_id:req.body.userid}).populate({path:"nrmlTopic",options:{ sort: {date: -1} }}).select("nrmlTopic").exec().then(result=>{
        res.status(res.statusCode).json({
            data: result.nrmlTopic,
            message: "other user posts",
            status: res.statusCode,
          });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            state:false
          });
    })*/
    //sort: {date: -1}
    user_collection.aggregate([
    {$match:{ $and:[{_id:Mongoose.Types.ObjectId(req.body.userid)}]}},
     {$limit: 1},
     {$project: {nrmlTopic:1,userName:1,userProfileImageUrl:1}},
     {$lookup:{
       from:'nrmltopics',
       let: { topicId:"$nrmlTopic"},    
       pipeline : [
         { $match: { 
           $expr:  {
            $and: [
               {$in: [ "$_id", "$$topicId" ]},
              { $eq: ['$anonyme', 'false'] }
            ]
             } 
           
          }, },
         {$project: {_id:1,userNameOwnerOfPost:1,date:1,postText:1,anonyme:1,comments:{$size:"$comments"},likes:{$size:"$likes"}}}
       ],
       as:"posts"
     }},
   ]).exec().then(result=>{
     res.status(res.statusCode).json({
         data: result[0].posts,
         message: "user posts",
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
exports.addCommentToPost = async (req, res) => {
}
exports.addLikeToPost = async (req, res) => {
}
exports.deletePost = async (req, res) => {
}
exports.reportPost = async (req, res) => {
}
