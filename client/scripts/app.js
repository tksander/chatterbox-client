// YOUR CODE HERE:
var safeInput = function(input){
  return encodeURI(input);
};

var drawChats = function(messageObj){

  var template = '<div class="chat">'
  template += '<div class="text" data-text="'  + safeInput(messageObj.text) +'">' + safeInput(messageObj.text) + '</div>';
  template += '<div class="username" data-username="' +  safeInput(messageObj.username) + '">' + safeInput(messageObj.username) + '</div>'; 
  template += '<div class="room>' + safeInput(messageObj.roomname) + '</div>';
  template += '</div>'
  $('#chats').append(template);
};


var app = {

  server: "https://api.parse.com/1/classes/chatterbox",
  friends: [],

  init: function(){

    app.fetch();

  },

  send: function(message, callback) {
    $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent', data);
      console.log(data);

      if (callback){
        callback();
      }

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

      for (var i = 0; i < data.results.length; i++){
         drawChats(data.results[i]);
      }
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
    drawChats(messageObj);

  },

  addRoom: function(roomName){
    $("#roomSelect").append("<div>" + roomName + "</div>");
  },

  addFriend: function(friend) {
    this.friends.push(friend);
  },

  handleSubmit: function() {

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
  //Run the app
  app.addMessage({
  username: 'Mel Brooks',
  text: 'I didn\'t get a harumph outa that guy.!',
  roomname: 'lobby'
});

app.init();


  $("#clearMessagesButton").on("click", function(){
    $("#chats").html("");
  });

  $("#fetchButton").on("click", function(){
    app.fetch();
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

  $("#sendMessageButton").on("click", function(){
    var name = prompt("whats your name?");
    var text = prompt("Whats your message?");
    var roomname = prompt("what's your roomname?");
    var message ={
      name: name,
      text: text,
      roomname: roomname
    }
    app.send(message);
  });

  $("#chats").on("click", ".username", function() {
    var name = $(this).data("username");
    app.addFriend(name);
    console.log(name);
  });

  $(document).submit(function() {
    app.handleSubmit();
  })

});
