const notification=(socket,io,onlineUser)=>{
    socket.on("sendNotficicationFromUserToUser",message=>{
   
        try{
        io.to(onlineUser[message.otherUserId].socketid).emit("getNotificationFromUserToUser",{notif:1});
        }catch(error){
            console.log(error)
        }
        //io.emit("getMessageFromUserToUser",message.text);
    })
}
module.exports=notification

