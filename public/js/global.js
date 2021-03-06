$(document).ready(function(){

    var socket=io();

    socket.on('connect',function(){
      
        var room = 'GlobalRoom'; // just a random room name and all users will join this room 
        var name = $('#name-user').val();
        var img = $('#name-image').val();

    
        socket.emit('global room',{
                        room: room,
                        name: name,
                        img: img
                        // this event is emitter when user connects
                        // now server listens for this event
                    });
    });

    socket.on('loggedInUser', function(users){
        var friends = $('.friend').text();
        var friend = friends.split('@');

        var name = $('#name-user').val().toLowerCase(); // this is logged in user name

        var ol = $('<div></div>'); 
        var arr = [];
        //ol.append('<p>hello</p>');
       
       // console.log(friend);
        for(var i=0;i<users.length; i++){
            if(friend.indexOf(users[i].name)>-1){
                arr.push(users[i]);

                var userName = users[i].name.toLowerCase(); // friend of logged in user
               var list = '<img src="https://placehold.it/300x300" class="pull-left img-circle"style="width:50px; margin-right:10px;" /><p>'+'<a id="val" href="/chat/'+userName.replace(/ /g,"-")+'.'+name.replace(/ /g,"-")+'"><h3 style="padding-top:15px;color:gray; font-size:14px;">'+'@'+users[i].name+'<span class="fa fa-circle online_friend"></span></h3></a></p>'   
                ol.append(list);
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });

});
