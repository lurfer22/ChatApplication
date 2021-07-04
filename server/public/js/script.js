window.onload = () => {
    const socket = io();
    const form = document.getElementById('sendMessageForm');
    const chat = document.getElementById('chatToPush');
    const username = getUsername();

    // send username to our server, used for records
    socket.emit('new user', (username));

    form.addEventListener('submit', (e) => {
        let input = form.message;
        e.preventDefault();
 
        if (input) {
            socket.emit('client message', input.value);
            // add new client message to user screen
            createAndAppendClientMessageDiv(input.value);
            // clear the users input box
            input.value = '';
        }
    });

    socket.on('chat message', (msg, senderUsername) => {
        createAndAppendExternalMessageDiv(msg, senderUsername);
    });
    
    function createAndAppendExternalMessageDiv(msg, senderUsername) {
        // Create a new paragraph element that holds the username of 
        // the sender of the msg
        const sender = document.createElement('p');
        sender.setAttribute('class', 'senderUsername');
        sender.innerHTML = senderUsername;

        const newChat = document.createElement('div');
        newChat.setAttribute('class', 'serverMessage mt-0 ml-5');

        const msgText = document.createElement('p');
        msgText.setAttribute('class', 'noOverflow');
        msgText.innerHTML = msg;

        newChat.appendChild(msgText);
        chat.appendChild(sender);
        chat.appendChild(newChat);
    }

    function createAndAppendClientMessageDiv(input) {
        const newUserChat = document.createElement("div");
        newUserChat.setAttribute('class', 'clientMessage mt-3 ml-5');
        
        const msg = document.createElement('p');
        msg.setAttribute('class', 'noOverflow');
        msg.innerHTML = input;

        newUserChat.appendChild(msg);
        chat.appendChild(newUserChat);
    }

    function getUsername() {
        let user = document.getElementById('username').innerHTML;
        return user.slice(9, user.length - 1);
    }
};



