const Mongoose = require("mongoose");
const chat_collection = require("../models/chat");
const ChatProfile_collection = require("../models/chatProfile");

exports.addMessage=(req,res)=>{
    var today = new Date()
    var ChatProfile;
    //il if hedhi bech nodhmen behha firstuser ou secound user dima i konou nafshom ki zouz abed yahkew
    if(req.verified.user_auth._id>req.body.receiver){
        ChatProfile= new ChatProfile_collection({
            firstUser:req.verified.user_auth._id,
            secoundUser:req.body.receiver,
            LastMessage:today,
            color:"#1876f3"
        })
    }else{
        ChatProfile= new ChatProfile_collection({
            firstUser:req.body.receiver,
            secoundUser:req.verified.user_auth._id,
            LastMessage:today,
            color:"#1876f3"
        })
    }
    var error = ChatProfile.validateSync();
    if (error != undefined) {
        console.log(error)
      return 
    }
    //hedhi ki yebda awel mara fi hyetou chyab3th msg lil abed etheka
    //ena nemchi nged chat profile 5as bkol zouz nsagel fih kif loun il conver wa9te e5er mara ba3tho msg ou ay haja t5oshom zouz m3a b3adhom
    //ou e5er msg tra wala le e5er mara amel vu al convertation wala le
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
            
           //kol mara we7d yab3eth msg tetsagel ma3lomet il msg ou nbadlo wa9t ta3 e5er msg binet zouz abed
            ChatProfile_collection.findOneAndUpdate({$or:[{$and: [{ firstUser:req.verified.user_auth._id}, { secoundUser: req.body.receiver }]},{$and: [{ firstUser:req.body.receiver}, { secoundUser: req.verified.user_auth._id }]}]},{$set:{LastMessage:today}}).then(data=>{
            }).catch(error=>{console.log(error)})

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
         

        }else{
            res.status(res.statusCode).json({
                message: "user not found",
                status: res.statusCode
            })  
        }
    
    }

    
}
//hne bech njibou les msg mta3 conver mo3ayan wa9t user fil front i hel conver api hedhi te5dem
exports.getMessagesOfCurrentconversation=(req,res)=>{
    if(req.body.secondUser!=undefined){
    //mi lowel nemchi lawech ala les msg li bninethom houwa dima andi 2 parametr seconduser ou li connecte tawa donc na3ml all chin thabet li 2 ethokom mawjoudin fil array users
    chat_collection.find( {users:{ $all : [req.verified.user_auth._id,req.body.secondUser]}}).sort({ date: -1 }).skip(req.body.skip).limit(20).exec().then(olddata=>{
        //ba3dika ba3d manjibhom lezmni na3ml vu lil mesaget le9dom li mafihomch vu    
            chat_collection.updateMany({$and:[{seen:false},{sender:req.body.secondUser},{reciver:req.verified.user_auth._id}]},{$set:{seen:true}},{new: true}).exec().then(newData=>{

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
    }else{
        res.status(res.statusCode).json({
            message: "reciver not found",
            status: res.statusCode
        })   
    }

}
//hne chin jib la3bed li hke m3ahom  njib asemehom tasawerhom ou 9ade min msg mahomch amel vu fil conver mte3hom
exports.getUserWhoChatWith=(req,res)=>{
    let messageWithSeenState=[]//hedhi array feha m3a chkoun hkit ou 9ade min msg ba3athlk kol profile ou ma9irtouch 
    //awel haja lawej al chat profile mte3hom
    ChatProfile_collection.find({$or:[{firstUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)},{secoundUser:Mongoose.Types.ObjectId(req.verified.user_auth._id)}]}).populate({path:"firstUser",select:'_id userName currentImageUrl'}).populate({path:"secoundUser",select:'_id userName currentImageUrl'})
    .sort({LastMessage:-1}).exec().then(async dataOfiUsersWhoChatWith=>{
        // ba3d majebt chat profile mte3hom ou jebet les donne mte3hom houma zouz
        
        //ena fi chat profile msagel first user ou second user ama mana3rch enehou menhom il current user donc lezmni na3rf  current user eneho menhom zouz
        //ndour ala list des chatprofile bil ka3ba bil ka3ba

        for(let i =0;i<dataOfiUsersWhoChatWith.length;i++){
            let senderid=""
        //ken firstuser == lil id mta3 li taleb il api hedha raho
        // ma3neha ena 7achti bi secounduser
        //ou ken secounduser == lil id mta3 li taleb il api hedha
        //raw ma3neha ena 7achti bil firstuser
            if(dataOfiUsersWhoChatWith[i].firstUser._id.equals(req.verified.user_auth._id)){
                senderid=dataOfiUsersWhoChatWith[i].secoundUser._id
            }else{
                senderid=dataOfiUsersWhoChatWith[i].firstUser._id
            }
           //tawa ba3d ma3rfana  sender chkon maw ena fi le5er 7achti bili ba3thouli messaget samithom senderid

            //necmhi lil collection chat ou lawej fin i koun reciver currentuser ou sender houwa li ena sagatlo fou9 ou lezm seen:false
            //hne 9a3ed lawej ala number of not read msg
            const countnotSeenMessageNumber = await chat_collection.countDocuments({reciver:req.verified.user_auth._id,sender:senderid,seen:false}).sort({ date: 1 }).limit(20).exec()
          
                // raja3 fil les donne mta3 reciver ou sender ou raja3 fi loun il conver ou raja3 9ade min msg not read
               messageWithSeenState.push({...dataOfiUsersWhoChatWith[i]._doc,color:dataOfiUsersWhoChatWith[i]._doc.color,notSeenMessageNumber:countnotSeenMessageNumber})
      

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
exports.updateColorChat=(req,res)=>{
    ChatProfile_collection.findOneAndUpdate({$or:[{$and: [{ firstUser:req.verified.user_auth._id}, { secoundUser: req.body.receiver }]},{$and: [{ firstUser:req.body.receiver}, { secoundUser: req.verified.user_auth._id }]}]},{$set:{color:req.body.newColor}}).then(data=>{
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