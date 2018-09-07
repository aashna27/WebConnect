module.exports = function(io , Global , _){
        const clients = new Global();

        io.on('connection', (socket)=>{ 

            socket.on('global room',(global)=>{ 
                socket.join(global.room);

                clients.EnterRoom(socket.id, global.name, global.room, global.img);
                // next thing is to get all users connected to the room & display their name and image on client side
                 
                const nameProp = clients.GetRoomList(global.room);
               // console.log(nameProp);
                const arr = _.uniqBy(nameProp,'name');
                //console.log(arr);
                io.to(global.room).emit('loggedInUser',arr); // now this arr will be emitted to everyone connected to this room

            });

            socket.on('disconnect',() =>{
                const user = clients.RemoveUser(socket.id);// return object
                if(user){
                    var userData = clients.GetRoomList(user.room);
                    const arr = _.uniqBy(userData,'name');
                    const removeData = _.remove(arr, {'name': user.name}); // removes data from arr
                    io.to(user.room).emit('loggedInUser',arr);
                     }
            })
        });
}  