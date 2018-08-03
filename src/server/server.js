import express from 'express';
import bodyParser from 'body-parser';
import { FirebaseOAuth } from './FirebaseAuth/firebaseOAuth';
import { challaneDB } from './FirebaseDb/challengesDb';

var http = require('http').Server(app);
var io = require('socket.io')(http);
const  app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//  app.use("/api/firebase",(req,res)=>{
//      var response =FirebaseOAuth();
//      console.log(response.auth());
//    res.send("Sucessfully Authentication");
// });

app.use("/api/challenge",(req, res)=> {
    console.log('req body', req.body);
    res.send(challaneDB(req.body));
});



var onlineUsers = [];

io.on('connection', function (socket) {

    socket.on('chatMessage', function (message) {
        io.to(message.receiver).emit('chatMessage', message);
    });

    socket.on('notifyTyping', function (sender, receiver) {
        io.to(receiver.id).emit('notifyTyping', sender, receiver);
    });

    socket.on('newUser', function (user) {
        var newUser = { id: socket.id, name: user };
        onlineUsers.push(newUser);
        io.to(socket.id).emit('newUser', newUser);
        io.emit('onlineUsers', onlineUsers);
    });

    socket.on('disconnect', function () {
        onlineUsers.forEach(function (user, index) {
            if (user.id === socket.id) {
                onlineUsers.splice(index, 1);
                io.emit('userIsDisconnected', socket.id);
                io.emit('onlineUsers', onlineUsers);
            }
        });
    });
});
 
app.listen(8080, () => console.log('Example app listening on port 8080!'));
