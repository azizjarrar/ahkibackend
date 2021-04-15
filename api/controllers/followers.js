
const followers_collection =require('../models/followers')
const follwing_collection =require('../models/following')

exports.countFollowersOfUser=(req,res)=>{
    followers_collection.countDocuments({userid:req.body.userid}).exec().then(result=>{
            res.status(res.statusCode).json({
            count: result,
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })
}
exports.getFollowersOfUser=(req,res)=>{
    followers_collection.find({userid:req.body.userid}).populate({path:"followersid",select:"_id currentImageUrl userName",options:{sort: {date: -1}}}).exec().then((result)=>{
        res.status(res.statusCode).json({
            data: result,
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })
}
exports.deleteFollow=(req,res)=>{
    followers_collection.findOneAndDelete({userid:req.verified.user_auth._id,followersid:req.body.theOtherPersonId}).exec().then((result)=>{
        follwing_collection.findOneAndDelete({userid:req.body.theOtherPersonId,followingid:req.verified.user_auth._id}).exec().then(result=>{
            res.status(res.statusCode).json({
                message: "user Removed",
                status: res.statusCode,
                });
        }).catch(error=>{
            res.status(res.statusCode).json({
            data: result,
            status: res.statusCode,
            });
        })

    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })
}