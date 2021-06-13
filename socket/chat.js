const chat=(socket,io,onlineUser)=>{
            //ki abed yab3ath msg iji hne ou  ne5o ena il msgo u id mta3 li b3atho ou naba3tho li chkon hab yaba3tho
            socket.on("sendMessageFromUserToUser",message=>{
                if(message.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[message.otherUserId].socketid).emit("getMessageFromUserToUser",{text:message.text,senderId:message.senderId});
                        }catch(error){
                            //console.log(error)
                        }
                }

                //io.emit("getMessageFromUserToUser",message.text);
            })
            // hedhi 5asa bech na3rf chkon 9a3ed yekteb
            socket.on("isWriting",data=>{
                if(data.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[data.otherUserId].socketid).emit("isWritingState",{isWriting:data.isWriting,senderid:data.senderid,userWhoReciveWriting:data.otherUserId});
                        }catch(error){
                            //console.log(error)
                        }
                }
            })
            // hedhi mta3 vu wa9te le5er i hel il conver wala yebda amale focus ala conver dima tetb3ath vu il le5er
            socket.on("vu",data=>{
                if(data.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[data.otherUserId].socketid).emit("setvu",{state:data.state});
                        }catch(error){
                           // console.log(error)
                        }
                }
            })

}
module.exports=chat
