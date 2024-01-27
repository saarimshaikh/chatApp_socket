// Client code
document.addEventListener('DOMContentLoaded', ()=>{
    //Establish a connection to the server using socket.io
    const socket = io();
    // This is a flag to track if the user is typing or not
    let typing = false;
    // Event handler for the form submission
    document.querySelector('form').addEventListener('submit', (event)=>{
        // Emit 2 things: a 'stop typing' event and also emitting a chat message event to the server
        socket.emit('stop typing');
        socket.emit('chat message', document.getElementById('m').value);
        //clear the input field
        document.getElementById('m').value='';
        // Prevent the default behavior of the browser
        event.preventDefault();
    });
    //Event handler for the input field when user is typing
    document.getElementById('m')
        .addEventListener('input', () => {
            if(!typing){
                typing=true;
                socket.emit('stop typing');
            }
            // Set a timeout to emit a 'stop typing' after 1 second
            setTimeout(()=>{
                typing = false;
                socket.emit('stop typing');
            }, 1000);
        });

// Event listener for receiving the chat message from the server
socket.on('chat message', (msg)=>{
        const li = document.createElement('li');
        //This is a regex function that replaces spaces with underscores
        const userClass = msg.user.replace(/\s+/g, '_');
        li.classList.add(userClass);
        li.textContent = `${msg.user}: ${msg.message}`;
        document.getElementById('messages').appendChild(li);

        //remove the typing indicator when a message is received
        const typingIndicator = document.querySelector('.typing-indicator');
        if(typingIndicator){
            typingIndicator.remove();
        }
    });

// Event listeners for receiving 'typing' events from other users.
socket.on('typing', (user) => {
    // Display a typing indicator in the message list
    const li = document.createElement('li');
    // Replace spaces with underscores
    const userClass =user.replace(/\s+/g, '_');
    li.classList.add('typing-indicator', userClass);
    li.textContent = `${user} is typing...`;
    document.getElementById('messages').appendChild(li);
});

// Event listeners for receiving 'Stop typing' events from other users.
socket.on('stop typing', ()=>{
    // Remove the typing indicator when a user stops typing.
    const typingIndicator = document.querySelector('.typing-indicator');
    if(typingIndicator){
        typingIndicator.remove();
    }
});
});