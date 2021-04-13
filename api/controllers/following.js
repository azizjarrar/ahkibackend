const following_collection =require('../models/following')
const notification_collection = require('../models/notification')
const user_collection = require('../models/user')
const Mongoose = require("mongoose");

exports.getFollowingOfUser=(req,res)=>{

}
exports.unfollowUser=(req,res)=>{
    following_collection.findOneAndDelete({userid:Mongoose.Types.ObjectId(req.verified.user_auth._id),followingid:Mongoose.Types.ObjectId(req.body.followingid)}).exec().then((result)=>{
        res.status(res.statusCode).json({
            message: "unfollow",
            state:3,
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })

}
exports.removeFollowPending=async (req,res)=>{
    following_collection.findOneAndDelete({userid:Mongoose.Types.ObjectId(req.verified.user_auth._id),followingid:Mongoose.Types.ObjectId(req.body.followingid)}).exec().then(async (result)=>{
        notification_collection.findOneAndDelete({from:Mongoose.Types.ObjectId(req.verified.user_auth._id),to:Mongoose.Types.ObjectId(req.body.followingid),type:"follow"}).exec().then(result=>{

       }).catch(error=>{
           console.log(error)
       });

        res.status(res.statusCode).json({
            message: "follow Pendding removed",
            state:3,
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })

}
exports.checkIffollow=(req,res)=>{
    following_collection.findOne({userid:Mongoose.Types.ObjectId(req.verified.user_auth._id),followingid:Mongoose.Types.ObjectId(req.body.followingid)}).exec().then((result)=>{
        if(result!=undefined && result!=null){
            if(result.panding==true){
                res.status(res.statusCode).json({
                    message: "stillpending",
                    state:1,
                    status: res.statusCode,
                    });
            }else{
                res.status(res.statusCode).json({
                    message: "you are following this user",
                    state:2,
                    status: res.statusCode,
                    }); 
            }
        }else{
            res.status(res.statusCode).json({
            message: "mkch mffolowih",
            state:3,
            status: res.statusCode,
            });
        }
    }).catch(error=>{
            res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode,
            });
    })

}

exports.followUser=(req,res)=>{
    var today = new Date()
    user_collection.findOne({_id:Mongoose.Types.ObjectId(req.body.followingid)}).exec().then((result)=>{
        if(result.privacy=="private"){
            const follwing = new following_collection({
                _id: new Mongoose.Types.ObjectId(),
                userid:req.verified.user_auth._id,
                followingid:req.body.followingid,
                followersince:today,
                panding:true
             })
             const notification = new notification_collection({
                _id: new Mongoose.Types.ObjectId(),
                text:req.body.text,
                type:"follow",
                from:req.verified.user_auth._id,
                to:req.body.followingid,
                date:today
             })
             follwing.save().then((result=>{
      
                notification.save().then((result)=>{
                    res.status(res.statusCode).json({
                        message: "mkch mffolowih",
                        state:1,
                        status: res.statusCode,
                        });
                }).catch(error=>{
                    console.log(error)
                    res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode,
                    state:1,
                    });
                })
             })).catch(error=>{
                    res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode,
                    state:4,
                    });
             })
        }else{
            const follwing = new following_collection({
                _id: new Mongoose.Types.ObjectId(),
                userid:req.verified.user_auth._id,
                followingid:req.body.followingid,
                followersince:today,
                panding:false
             })
             const notification = new notification_collection({
                _id: new Mongoose.Types.ObjectId(),
                text:req.body.text,
                type:"follow",
                from:req.verified.user_auth._id,
                to:req.body.followingid,
                date:today
             })
             follwing.save().then((result=>{
                res.status(res.statusCode).json({
                    message: "rak mfollowih",
                    state:2,
                    status: res.statusCode,
                    });
                notification.save().then((result)=>{
                }).catch(error=>{
                    res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode,
                    });
                })
             })).catch(error=>{
                    res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode,
                    });
             })
        }
    })


}
exports.acceptfollow=(req,res)=>{
    following_collection.findOneAndUpdate({userid:Mongoose.Types.ObjectId(req.body.followingid),followingid:Mongoose.Types.ObjectId(req.verified.user_auth._id)},
    {$set:{panding:false}}
    ).exec().then((result)=>{
        notification_collection.findOneAndDelete({from:Mongoose.Types.ObjectId(req.body.followingid),to:Mongoose.Types.ObjectId(req.verified.user_auth._id),type:"follow"}).exec().then(result=>{})

        res.status(res.statusCode).json({
            message: "now you can follow user",
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        });
 })

}
exports.deniedfollow=(req,res)=>{
    following_collection.findOneAndDelete({userid:Mongoose.Types.ObjectId(req.body.followingid),followingid:Mongoose.Types.ObjectId(req.verified.user_auth._id)}).exec().then((result)=>{
        notification_collection.findByIdAndDelete({_id:Mongoose.Types.ObjectId(req.body.idNotif)}).exec();
        res.status(res.statusCode).json({
            message: "follow is deleted",
            status: res.statusCode,
            });
    }).catch(error=>{
        res.status(res.statusCode).json({
        message: error.message,
        status: res.statusCode,
        });
 })
}
