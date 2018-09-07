module.exports = function(io){
/* client provides the room by emitting event server makes the users join the room   */ 
    io.on('connection', (socket) =>{
         socket.on('join-room', (params) =>{
             socket.join(params.room1);
                socket.join(params.room2); // any user that have their path name as these will be able to join connection
                
         });

         socket.on('private message', (message,callback) =>{
// to emit event to client connected to a particular room including sender
                io.to(message.room).emit('new message',{ // once msg submitted by user it needs to be put on the screen 
                                text: message.text,
                                sender: message.sender
                            });
            callback();
         })
    });
}