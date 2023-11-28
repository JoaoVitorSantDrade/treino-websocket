import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import readline from 'readline';

const socket = new SockJS('http://localhost:8080/ws');
const stompClient = Stomp.over(socket);

function sendMessage(message) {
    if (stompClient.connected) {
        stompClient.send('/app/hello', {}, JSON.stringify({ name: message }));
    } else {
        console.error('WebSocket connection not established yet. Cannot send message.');
    }
}

stompClient.connect({}, (frame) => {
    console.log('WebSocket connection opened');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    stompClient.subscribe('/topic/greetings', (message) => {
        console.log(message.body);
        // Handle the incoming message (e.g., update the UI with the message)
    });

    // Prompt the user for their name
    rl.question('Digite seu nick: ', (name) => {
        sendMessage(`${name} entrou no chat`);

        // Start reading messages from the console and sending them
        rl.prompt();
        rl.on('line', (input) => {
            sendMessage(input);
            rl.prompt();
        }).on('close', () => {
            console.log('Chat closed. Goodbye!');
            process.exit(0);
        });
    });

    
}, (error) => {
    console.error('WebSocket connection failed:', error);
});
