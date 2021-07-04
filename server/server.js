const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.use(express.urlencoded());
app.use(express.json());

app.set('view engine', 'ejs');

// hold usernames of all connected users
const users = [];

app.get('/', (req, res) => {
  res.render('home', {loginError: null});
});

app.post('/chat', (req, res) => {
  // check if username exists
  var username = req.body.username;
  if (findIndexOfUsername(username) !== -1) {
    res.render('home', {loginError: "Whoops! That username is already in use!"});
  
  } else {
    res.render('chat', {username: req.body.username});
  
  }
});

io.on('connection', (socket) => {
  socket.on('new user', (username) => {
    console.log('New user has connected');
    // create new object to hold user login details
    // and socket id
    const newUser = {
      id: socket.id,
      username: username
    };

    users.push(newUser);
  });


  // when client sends a chat message
  socket.on('client message', (msg) => {
    // emit the chat message to everyone except the sender
    // also need to send the username of the user who sent the message
    let senderObjIndex = findIndexOfId(socket.id);
    let senderUsername = '';

    if (senderObjIndex === -1) {
      senderUsername = 'null';
    } else {
      senderUsername = users[senderObjIndex].username;
    }

    socket.broadcast.emit('chat message', msg, senderUsername);  
  });

  // when client disconnects from the server
  socket.on('disconnect', () => {
    // remove their id from our users array
    removeSocketIdFromUsers(socket.id);

    console.log('User disconnected');
  });
});

http.listen(8080, () => {
  console.log('listening on 8080');
});

const removeSocketIdFromUsers = (id) => {
  let index = findIndexOfId(id);
  if (index > -1) {
    users.splice(index, 1);
  }
};

// find index of socket.id
const findIndexOfId = (id) => {
  let index = -1;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
};

// find index of username
const findIndexOfUsername = (username) => {
  let index = -1;
  console.log('length: ' + users.length);
  for (let i = 0; i < users.length; i++) {
    if (users[i].username === username) {
      index = i;
      break;
    }
  }
  return index;
};

