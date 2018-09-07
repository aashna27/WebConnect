/* This file holds the jquery code required send data to the server and also display data on browser */
$(document).ready(function(){
    var socket = io(); // by default for the host page  // io(" url here "); if it needs to be used for specific url
                        // io is available due to the script added in group.ejs page 
    var room = $('#groupName').val(); // using id of hidden field
    var sender = $('#sender').val();
    socket.on('connect',function(){
        console.log('Client side ->User Connected');

        var params ={
             room : room,
             name: sender
            }

        socket.emit('join',params,function(){ // emit(name of event, object , additional callback fn )
            console.log('User connected  to this channel');

            /* now we also want server to listen for this event */
        });

    });

    socket.on('usersList',function(users){
       // console.log(users);

      var ol = $('<ol></ol>');
      for(var i=0;i<users.length;i++){
          ol.append('<p> <a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>');
      }

      // Jquery Event Delegation
         $(document).on('click','#val',function(){ /* on a click event on the <a> tag above , call this function*/
             $('#name').text('@'+$(this).text());
             /* the tag in group.ejs with name id ,should have  $(this).text() & this refers to the "users[i]" above"
              --> we want the text of the currently clicked elements */

              $('#receiverName').val($(this).text());
              $('#nameLink').attr("href","/profile/"+$(this).text());
         });
        $('#numValue').text('('+users.length+')'); // .text is used for elements eg- h1, div ,span etc..
        $('#users').html(ol);// .html or .text is used to add data to an already existing html element in jquery

    });

    socket.on('newMessage',function(data){
      //  console.log(data);
      var template = $('#message-template').html();
      var message = Mustache.render(template,{
          text:data.text,
          sender: data.from
      });
      $('#messages').append(message);


    })

    $('#message-form').on('submit',function(event){
        event.preventDefault(); // this is to prevent reload when the form is submitted 

        var msg = $('#msg').val();

        socket.emit('createMessage',{  //syntax ->emit(event name , data you want to send {its an object })
              text: msg,  // gets message from input field "textarea"
              room: room,
              sender: sender  
            // key-val pair 
        },function(){
            $('#msg').val('');
        });
        /*event has been emitted at the client now it needs to be listened by the server */
    });

});