const Path = require('path');
const http = require('http');
const moment = require('moment');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const formatMessages = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');
const { DiffieHellmanGroup } = require('crypto');

//creating server
const app = express();
const server = http.createServer(app);
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`server runing on port ${PORT}`));
app.use(express.static(Path.join(__dirname, 'public'))); //static folder setted

//creating socket
const io = socketio(server);
const botName = 'chat Bot'

//connection to database
const uri = "mongodb://localhost:27017";
const dbclient = new MongoClient(uri);

const usercollection = dbclient.db('inbox').collection('user');
const msgcollection = dbclient.db('inbox').collection('messages');

async function mesg(){

}
mesg();

async function cUser(id){
    const user = await usercollection.find({socketid : id}).limit(1).toArray();
    const cname = user[0];
    return cname;
}

//runs when client connect
io.on('connection', socket => {
    socket.on('joinRoom', async({ username, room }) => {
        console.log(`${username} has joined the chat in ${room}`);
        await usercollection.insertOne({socketid: socket.id, name: username, room: room ,time : new Date()});
        const user = userJoin(socket.id,username,room);

        socket.join(room);

        //broadcast that the user is connected but not looged in user
        socket.broadcast.to(room).emit('message', {name : 'Admin',message : `${username} has connected`, time : new Date()});

        io.to(room).emit('roomUsers', {
            room: room,
            users: getRoomUsers(room)
        });
    });
    socket.on('prevMessage',async (room) => {
        const msg = await msgcollection.find({room: room}).limit(100).sort().toArray();
        socket.emit('messages', msg)
        socket.emit('message', {name : "bot", message : "welcome to chat!", time : new Date()})
    })

    socket.on('chatMessage',async ({username,msg,room}) => {
        msgcollection.insertOne({socketid : '1',name : username ,room : room, message: msg, time: moment().format('h:mm a')});
        const mesg = {name: username,message: msg,time: moment().format('h:mm a')}
        console.log(mesg)
        io.to(room).emit('message', mesg)
    })
    
    socket.on('disconnect', async() => {
        const user = userLeave(socket.id);
        const cName = await cUser(socket.id);
        socket.broadcast.to(cName.room).emit('message', {name : 'Admin',message : `${cName.name} has disconnected`, time : new Date()});
        const deleteUser = await usercollection.deleteOne({ socketid: socket.id });
    });
});