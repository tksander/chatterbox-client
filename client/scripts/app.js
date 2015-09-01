// YOUR CODE HERE:
var safeInput = function(input){
  //var wacky = "<script>alert('a')</script>"
 // return encodeURI(input);

 //, <, >, ", ', `, , !, @, $, %, (, ), =, +, {, }, [, and ] 
 //Ref: http://www.ascii.cl/htmlcodes.htm
 //Ref: http://wonko.com/post/html-escaping

  var sanitizedInput = [];
  var badContent = false;

  if (input){
    for (var i = 0; i < input.length; i++){
      var currentChar = input[i];

      if (currentChar === " "){
        sanitizedInput[i] = "&#32;";
        badContent = true;
      }

      if (currentChar === "<"){
        sanitizedInput[i] = "&#60;";
        badContent = true;
      }

     if (currentChar === ">"){
        sanitizedInput[i] = "&#62;";
        badContent = true;
      }

      if (currentChar === "$"){
        sanitizedInput[i] = "&#36;";
        badContent = true;
      }

      if (!badContent){
        sanitizedInput[i] = input[i];             
      }

      badContent = false;
    }

  }

  return sanitizedInput.join("");


};



var drawChats = function(messageObj){

  var template = '<div class="chat">'
  template += '<div class="text" data-text="'  + safeInput(messageObj.text) +'">' + safeInput(messageObj.text) + '</div>';
  template += '<div class="username" data-username="' +  safeInput(messageObj.username) + '">' + safeInput(messageObj.username) + '</div>'; 
  template += '<div class="room">' + safeInput(messageObj.roomname) + '</div>';
  template += '<div class="timeCreated">' + messageObj.createdAt + '</div>'
  template += '</div>'
  $('#chats').prepend(template);
};


var app = {
  skip: 0,
  limit: 100,
  server: "https://api.parse.com/1/classes/chatterbox",
  friends: [],
  rooms: [],

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
  //#Bugfix: Clicking button multiple times results in repeats
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'GET',
    contentType: 'application/json',
    data : {
    limit : app.limit,
    order : "-createdAt",
    },
    success: function (data) {
      console.log('Got data');
      console.log(data);

      for (var i = 0; i < data.results.length; i++){
         //Filter out obviously blank/ridiculous chats
         if (data.results[i].text !== undefined && data.results[i].username !== undefined){
           drawChats(data.results[i]);
         }

         // Filter out roomNames, add unique roomNames only
         if(app.rooms.indexOf(data.results[i].roomname) === -1) {
          if(data.results[i].roomname !== undefined && data.results[i].roomname !== "" && data.results[i].roomname !== null && data.results[i].roomname !== " ") {
            app.rooms.push(data.results[i].roomname);
          }
         }
      }

      for(var i = 0; i < app.rooms.length; i++) {
        $("#roomSelect").append('<option value="' + safeInput(app.rooms[i]) + '">' + safeInput(app.rooms[i]) + '</option>');
      }

      app.skip += 10;

      app.highlightFriends();
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to retrieve message');
      console.log(data);
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
    $("#roomSelect").append('<option value="' + roomName + '">' + roomName + '</option>');
  },

  addFriend: function(friend) {
    if(this.friends.indexOf(friend) === -1) {
      this.friends.push(friend);
      $("#friendList").append('<option value="' + friend + '">' + friend + '</option>');
      this.highlightFriend(friend);
    }
  },

  handleSubmit: function() {

  },

  // 
  highlightFriends: function() {

    if(app.friends.length > 0) {
      // iterate through the friends array
      for(var i = 0; i < this.friends.length; i++) {
        // pass that friend to jQuery to filter through the chatboxes and apply bolding style
        $("#chats .chat").filter(function(index, element) {
          return element.children[1].innerText === app.friends[i];
        }).css('background-color', 'red');
      }
    }
  },

  highlightFriend: function(friend) {
    $("#chats .chat").filter(function(index, element) {
          return element.children[1].innerText === friend;
        }).css('background-color', 'red');
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
    var name = $("#modalUsername").val();
    var text = $("#modalMessage").val();
    var roomname = $("#modalRoomname").val();
    var message ={
      name: name,
      text: text,
      roomname: roomname
    }
    app.send(message);
    app.addMessage(message);
    $("#modalMessage").val("");
    $("#modalRoomname").val("");
  });

  $("#chats").on("click", ".username", function() {
    var name = $(this).data("username");
    app.addFriend(name);
    console.log(name);
  });

  $(document).submit(function() {
    app.handleSubmit();
  })

  $( "#roomSelect" ).change(function() {
    var theRoom = this.value;

    if (theRoom === "all"){
      //Turn on everything else
      $("#chats .chat").css("display", "block");
    }else{
          $("#chats .chat").filter(function( index, element) { 
      console.log(element.children[2].innerText);
       // console.log($(element).children()[2]);

      //return {does the elment have text not equal to theRoom}
      //console.log($(element).find($(element).children()[2]));
      // console.log($(element).find($(element).children()[2]).innerText);
      return element.children[2].innerText !== theRoom;
     }).css( "display", "none" );

    }
    
    // return $(element).roomthing.hasClass(theRoom))
    //hasClass(theRoom))
  });


//$("#chats .chat")[203].children[2].innerText

  //Prepend the new stuff
  //append the old stuff
});

//Todo:
  //Bootstrap
  //Peronsal messages
  //Nice fetch-- automated

// objectid| username| text| roomname| created/updated/acl| targetUser
// where={"targetUser": {{currentuser}} 


//INBOX
  //Query on targetUser ===currentUser

//Outbox
  //Query on username === currentUser && targetUser is defined


  // collect roomnames as chats are fetched - store
    // drop down for roomnames
      // jquery filter



