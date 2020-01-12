$(document).ready(function(){
    var socket = io();

    socket.on('connect', function(){

        var room = 'GlobalRoom';
        var name = $('#name-user').val();
        var img = $('#image-user').val();

        socket.emit('global room',{
            room: room,
            name: name,
            img: img
        });

        socket.on('message display', function(){
            $('#reload').load(location.href + ' #reload');
        });
    });

    socket.on('loggedInUser', function(users){ //listing this function from the server
        var friends = $('.friend').text();
        var friend = friends.split('@');

        // var images = $('#images').val();
        // var arrImages = images.split(',');

        var friendTrim = [];

        $.each(friend, function(){
            friendTrim.push($.trim(this));
        });

        var name = $('#name-user').val().toLowerCase();
        var ol = $('<div></div>');
        var arr = [];
        
        for(var i = 0 ; i < users.length; i++){
            if(friendTrim.indexOf(users[i].name) > -1){
                arr.push(users[i]);

                var userName = users[i].name.toLowerCase();

                var list = '<div><img src="https://placehold.it/300x300" class="pull-left img-circle" style="width:50px; margin-right:10px;" /><p>'+
                '<a id="val" href="/chat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><h3 style="padding-top:15px;color:gray; font-size: 14px">'+'@'+users[i].name+'<span class="fa fa-circle online_friend"></span></h3></a></p></div>';
                ol.append($(list));
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(ol);
    });
});