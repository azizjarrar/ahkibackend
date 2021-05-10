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
                message:req.body.message,
                seen:false,
                sender:req.verified.user_auth._id,
                reciver:req.body.receiver,
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
            ChatProfile_collection.findOneAndUpdate({uniqueidForBothUsers:idBothUsers},{$set:{LastMessage:today}}).then(data=>{
                chat = new chat_collection({
                    _id: new Mongoose.Types.ObjectId(),
                    date:today,
                    users:[req.verified.user_auth._id,req.body.receiver],
                    message:req.body.message,
                    seen:false,
                    sender:req.verified.user_auth._id,
                    reciver:req.body.receiver,

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
    chat_collection.find( {users:{ $all : [req.verified.user_auth._id,req.body.secondUser]}}).sort({ date: -1 }).skip(req.body.skip).limit(20).exec().then(olddata=>{
        chat_collection.updateMany( {users:{ $all : [req.verified.user_auth._id,req.body.secondUser]}},{$set:{seen:true}},{new: true}).exec().then(newData=>{

            res.status(res.statusCode).json({
                data: olddata,
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
}
exports.getUserWhoChatWith=(req,res)=>{
    let messageWithSeenState=[]

    ChatProfile_collection.find({$or:[{firstUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)},{secoundUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)}]}).populate({path:"firstUser",select:'_id userName currentImageUrl'}).populate({path:"secoundUser",select:'_id userName currentImageUrl'})
    .sort({LastMessage:-1}).exec().then(async dataOfiUsersWhoChatWith=>{
        for(let i =0;i<dataOfiUsersWhoChatWith.length;i++){
            let senderid=""
            if(dataOfiUsersWhoChatWith[i].firstUser._id.equals(req.verified.user_auth._id)){
                senderid=dataOfiUsersWhoChatWith[i].secoundUser._id
            }else{
                senderid=dataOfiUsersWhoChatWith[i].firstUser._id
            }
           // console.log("/*************************/")
            const countnotSeenMessageNumber = await chat_collection.countDocuments({reciver:req.verified.user_auth._id,sender:senderid,seen:false}).sort({ date: 1 }).limit(20).exec()
          //  console.log(countnotSeenMessageNumber)
            
               messageWithSeenState.push({...dataOfiUsersWhoChatWith[i]._doc,notSeenMessageNumber:countnotSeenMessageNumber})
      

        }
        res.status(res.statusCode).json({
            data: messageWithSeenState,
            status: res.statusCode
        }) 
  
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })

}
      

exports.getUnreadUsersChatsNumber=(req,res)=>{
    let howManyUsersChatNotSeen=0

    ChatProfile_collection.find({$or:[{firstUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)},{secoundUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)}]}).populate({path:"firstUser",select:'_id userName currentImageUrl'}).populate({path:"secoundUser",select:'_id userName currentImageUrl'})
    .sort({LastMessage:-1}).exec().then(async dataOfiUsersWhoChatWith=>{
        for(let i =0;i<dataOfiUsersWhoChatWith.length;i++){
            let senderid=""
            if(dataOfiUsersWhoChatWith[i].firstUser._id.equals(req.verified.user_auth._id)){
                senderid=dataOfiUsersWhoChatWith[i].secoundUser._id
            }else{
                senderid=dataOfiUsersWhoChatWith[i].firstUser._id
            }
           // console.log("/*************************/")
            const countnotSeenMessage = await chat_collection.findOne({$and:[{reciver:req.verified.user_auth._id},{sender:senderid},{seen:false}]}).exec()

          //  console.log(countnotSeenMessageNumber)
                if(countnotSeenMessage!=undefined && countnotSeenMessage!=null){
                    howManyUsersChatNotSeen=howManyUsersChatNotSeen+1
                }
      
        }
        res.status(res.statusCode).json({
            data: howManyUsersChatNotSeen,
            status: res.statusCode
        }) 
  
    }).catch(error=>{
        res.status(res.statusCode).json({
            message: error.message,
            status: res.statusCode
        })  
    })
}