const http = require('http')
const app = require('./app')
const fs = require('fs')
const path = require('path')
const port = process.env.Port || 5010
const server = http.createServer({
  key:fs.readFileSync(path.join(__dirname,'cert','key.pem')),
  cert:fs.readFileSync(path.join(__dirname,'cert','cert.pem'))
},app)
const notification=require("./socket/notification")
const chat=require("./socket/chat")
var onlineUser={}
const io = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000"
    //  origin: "http://46.101.169.142:3000",
    }
  });

server.listen(port,()=>{
  console.log("server online")
})
io.on("connection to socket", (socket) => {
    socket.emit("getSocketid",socket.id)
    socket.on("saveuserOnline",data=>{
      if(data.userid!=undefined){
        onlineUser[data.userid]={...data,online:true}

      }
    })
    notification(socket,io,onlineUser)
    chat(socket,io,onlineUser)
    socket.on('disconnect', function () {
      
    });
    
 });

