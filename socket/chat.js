const chat=(socket,io,onlineUser)=>{
       
            socket.on("sendMessageFromUserToUser",message=>{
                try{
                io.to(onlineUser[message.otherUserId].socketid).emit("getMessageFromUserToUser",{text:message.text,senderId:message.senderId});
                }catch(error){
                    console.log(error)
                }
                //io.emit("getMessageFromUserToUser",message.text);
            })
        
     
  

}
module.exports=chat
