const chatForm = document.getElementById('chat-form');
const chatMessage = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room for url
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

socket.emit('joinRoom',{ username, room });
socket.emit('prevMessage', room);

//get room and user
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('messages', (msg)=>{
    for (let index = 0; index < msg.length; index++) {
        const element = msg[index];
        outputMessage(element);
        
    }

    // sroll bottom
    chatMessage.scrollTop = chatMessage.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    //get text message
    const msg = e.target.elements.msg.value;

    //emiting message to server
    socket.emit('chatMessage', {username,msg,room});

    //clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

socket.on('message', (msg)=>{
        outputMessage(msg);

    // sroll bottom
    chatMessage.scrollTop = chatMessage.scrollHeight;
});

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta">${message.name} <span>${message.time}</span></p>
						<p class="text">
                        ${message.message}
						</p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

//add room name to dom
function outputRoomName(room){
    roomName.innerText = room;
}

//add user to dom
function outputUsers(users){
    userList.innerHTML =`
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
