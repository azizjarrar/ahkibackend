const chat=(socket,io,onlineUser)=>{
       
            socket.on("sendMessageFromUserToUser",message=>{
                if(message.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[message.otherUserId].socketid).emit("getMessageFromUserToUser",{text:message.text,senderId:message.senderId});
                        }catch(error){
                            console.log(error)
                        }
                }

                //io.emit("getMessageFromUserToUser",message.text);
            })
            socket.on("isWriting",data=>{
                if(data.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[data.otherUserId].socketid).emit("isWritingState",{isWriting:data.isWriting,senderid:data.senderid,userWhoReciveWriting:data.otherUserId});
                        }catch(error){
                            console.log(error)
                        }
                }
            })
     
            socket.on("vu",data=>{
                if(data.otherUserId!=undefined){
                    try{
                        io.to(onlineUser[data.otherUserId].socketid).emit("setvu",{state:data.state});
                        }catch(error){
                            console.log(error)
                        }
                }
            })

}
module.exports=chat
