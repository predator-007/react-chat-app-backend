const express=require('express');
const app=express();
const http=require('http');
const server=http.createServer(app);
const cors=require('cors');
const socket=require('socket.io');
const io =socket(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST"]
    }
}); 

app.use(cors());
app.get("/",(req,res)=>{
    res.send("server is running");
});

io.on("connection",(socket)=>{
    
    socket.emit("me",socket.id);

    socket.on("disconnect",()=>{
        socket.broadcast.emit("callEnded");
    });

    
    socket.on("callUser",(data)=>{
        io.to(data.userToCall).emit("callUser",{signal:data.signalData,from:data.from,name:data.name});
    });
    
    socket.on("answerCall",(data)=>{
        io.to(data.to).emit("callAccepted",data.signal);
    })

});


const PORT=process.env.PORT||5000;
server.listen(PORT,()=>console.log('server listening on '+PORT));