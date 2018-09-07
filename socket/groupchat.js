
module.exports = function(io,Users){
    /* all the events that server emits of listens are inside the io.on method */
   
    const users = new Users();
   
   
    io.on('connection', (socket) =>{ // ES6 function method used with socket as parameter passed
        //console.log('User Connected');

        socket.on('join',(params,callback) =>{
            socket.join(params.room); // socketio method ,that joins user to a room and takes room name as parameter
            users.AddUserData(socket.id,params.name,params.room);
            //console.log(users);
           
            io.to(params.room).emit('usersList',users.GetUsersList(params.room));



            callback();
        })

        socket.on('createMessage',(message,callback) => {
            console.log(message);

            io.to(message.room).emit('newMessage',{ // to-> emits messages within the specified room 
                text:message.text,
                room: message.room,
                from: message.sender
            });
            callback();
            /*
            io.emit('newMessage',{ // broadcasting 
                text:message.text
            })
                /* this has a drawback that it will emit event to all  clients , not considering the group */
              //   // event that will emit to all users connected , including the sender 
        });

        socket.on('disconnect',() =>{
            var user = users.RemoveUser(socket.id);
            if(user){
                io.to(user.room).emit('usersList',users.GetUsersList(user.room));
                    }
        })
       
    });

}

/* C:  '.\Program Files\MongoDB\Server\3.6\bin'  */
/* cd /. */


/* we emit an event when a user connects to a channnel , so all users and connected to that channel will receive that event */