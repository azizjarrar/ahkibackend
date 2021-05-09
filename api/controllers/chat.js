const Mongoose = require("mongoose");
const chat_collection = require("../models/chat");
const ChatProfile_collection = require("../models/chatProfile");

exports.addMessage=(req,res)=>{
    var today = new Date()
    var ChatProfile;
    var idBothUsers 
    if(req.verified.user_auth._id>req.body.receiver){
        ChatProfile= new ChatProfile_collection({
            firstUser:req.verified.user_auth._id,
            secoundUser:req.body.receiver,
            LastMessage:today,
        })
    }else{
        ChatProfile= new ChatProfile_collection({
            firstUser:req.body.receiver,
            secoundUser:req.verified.user_auth._id,
            LastMessage:today,
        })
    }
    var error = ChatProfile.validateSync();
    if (error != undefined) {
        console.log(error)
      return 
    }
    if(req.body.FirstTime==0){
        ChatProfile.save().then(result=>{
            chat = new chat_collection({
                _id: new Mongoose.Types.ObjectId(),
                date:today,
                users:[req.verified.user_auth._id,req.body.receiver],
                message:req.body.message
            })
            var error = chat.validateSync();
            if (error != undefined) {
              res.status(res.statusCode).json({
                message: "invalid chat",
                status: res.statusCode,
                state:false
              });
              return 
            }
            chat.save().then(result=>{
                ChatProfile_collection.findOneAndUpdate({})
                res.status(res.statusCode).json({
                    message: "message was added",
                    status: res.statusCode
                })  
            }).catch(error=>{
                res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode
                })  
            })
        }).catch(error=>{
            res.status(res.statusCode).json({
                message: error.message,
                status: res.statusCode
            })  
        })
    }else{
        if(req.body.receiver!=undefined){
            ChatProfile_collection.findOneAndUpdate({uniqueidForBothUsers:idBothUsers},{$set:{date:today,LastMessage:today}}).then(data=>{
                chat = new chat_collection({
                    _id: new Mongoose.Types.ObjectId(),
                    date:today,
                    users:[req.verified.user_auth._id,req.body.receiver],
                    message:req.body.message
                })
                var error = chat.validateSync();
                if (error != undefined) {
                  res.status(res.statusCode).json({
                    message: "invalid chat",
                    status: res.statusCode,
                    state:false
                  });
                  return 
                }
                chat.save().then(result=>{
                    ChatProfile_collection.findOneAndUpdate({})
                    res.status(res.statusCode).json({
                        message: "message was added",
                        status: res.statusCode
                    })  
                }).catch(error=>{
                    res.status(res.statusCode).json({
                        message: error.message,
                        status: res.statusCode
                    })  
                })
            }).catch(e=>{
                res.status(res.statusCode).json({
                    message: error.message,
                    status: res.statusCode
                })  
            })

        }else{
            res.status(res.statusCode).json({
                message: "user not found",
                status: res.statusCode
            })  
        }
    
    }

    
}
exports.getMessagesOfCurrentconversation=(req,res)=>{
    chat_collection.find( {users:{ $all : [req.verified.user_auth._id,req.body.secondUser]}}).sort({ date: 1 }).limit(20).exec().then(data=>{
        res.status(res.statusCode).json({
            data: data,
            status: res.statusCode
        })  
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}
exports.getUserWhoChatWith=(req,res)=>{
    
    ChatProfile_collection.find({$or:[{firstUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)},{secoundUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)}]})
    .populate({path:"firstUser",select:'_id userName currentImageUrl'}).populate({path:"secoundUser",select:'_id userName currentImageUrl'})
    .sort({LastMessage:-1}).exec().then(data=>{
        console.log(data)
        res.status(res.statusCode).json({
            data: data,
            status: res.statusCode
        })  
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })

}
      

