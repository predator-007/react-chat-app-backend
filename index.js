const app=require('express')()
const server=require('http').createServer(app)
const cors=require('cors');
const io=require('socket.io')(server,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})
app.use(cors())
app.get('/',(req,res)=>{
    res.send("server is running");
})
const ns={}
const sn={}

io.on("connection",(socket)=>{
    
    socket.on("connectToSocket",(data)=>{
        ns[data]=socket.id
        sn[socket.id]=data
        console.log(data +" connected")
        console.log("connected User:")
        console.log(ns)
        io.emit("updateUser",ns)
    })
    
    socket.on("callUser", (data) => {
        console.log("calling invoked to",ns[data.to],data.to);
        io.to(ns[data.to]).emit("callUser", { signal: data.signalData, from: data.from })
	})
    
    socket.on('answerCall',(data)=>{
        console.log('call answered');
        io.to(ns[data.to]).emit("callAccepted",data.signal);
    })
    socket.on('disconnect',()=>{
        const name=sn[socket.id];
        delete sn[socket.id];
        delete ns[name];
        console.log(name+" disconnected")
        console.log(ns)
        io.emit("updateUser",ns);

    })
})


const PORT=process.env.PORT||5000
server.listen(PORT,()=>console.log("server running"));