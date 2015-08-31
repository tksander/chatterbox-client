// YOUR CODE HERE:
var app = {

  server: "https://api.parse.com/1/classes/chatterbox",

  init: function(){



  },

  send: function(message) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      console.log(data);

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
      console.log(data)
    }
  });
},

fetch: function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      console.log('Got data');
      console.log(data);

    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
  },

  clearMessages: function(){
    $("#chats").html("");
  },

  addMessage: function(messageObj){
  
    $('#chats').append("<div>"  + messageObj.text + "</div>")
  },

  addRoom: function(roomName){
    $("#roomSelect").append("<div>" + roomName + "</div>");
  }

};




//app.send({ username: 'shawndrost', text: 'trololo', roomname: '4chan' });

    var message = {
          username: 'Mel Brooks',
          text: 'Never underestimate the power of the Schwartz!',
          roomname: 'lobby'
        };
//Click handlers

$(document).ready(function(){

  $("#clearMessagesButton").on("click", function(){
    $("#chats").html("");
  });

  $("#addMessagesButton").on("click", function(){
    var message = 
         {username: 'Mel Brooks',
          text: 'I didn\'t get a harumph outa that guy.!',
          roomname: 'lobby'
        }
    app.addMessage(message);
  });

  $("#addRoomButton").on("click", function(){
    var roomName = prompt("What's the room name?");
    app.addRoom(roomName);
  });



});
