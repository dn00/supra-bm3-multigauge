const WebSocketServer = require('ws').Server;
const http = require('http');
const Stomp = require('stompjs');
const SockJS = require('sockjs-client');  // Ensure you have sockjs-client installed

const HEADER = {"app-version": "1.00.000-1"};
const ENDPOINT = 'http://localhost:8080/ws'; 

const server = http.createServer();
const wss = new WebSocketServer({ server: server, path: "/ws" });

function constructStompFrame(command, headers, body) {
    // Construct the headers string
    const headersStr = Object.entries(headers)
      .map(([key, value]) => `${key}:${value}`)
      .join('\n');
  
    // Construct the full frame string
    return `${command}\n${headersStr}\n\n${body}\0`;
  }

server.listen(8081, function() {
  console.log('Node.js proxy server listening on port 8081');
});

wss.on('connection', function connection(ws) {
  console.log('Python app connected');
  let stompClient = null;

  ws.on('message', function incoming(frame) {
    try {
      console.log('Received STOMP frame from Python:', frame);
      const frameStr = frame.toString();
      const lines = frameStr.split('\n');
      const command = lines[0];
      if (command === "CONNECT" && !stompClient) {
        // Parse the CONNECT frame from Python to extract the server URL
        const frameStr = frame.toString();
        const lines = frameStr.split('\n');
        const connectLine = lines.find(line => line.startsWith('CONNECT'));
        console.log('CONNECT line:', lines)
        if (connectLine) {
          console.log('Connecting to external STOMP server:', ENDPOINT);
          let socket = new SockJS(ENDPOINT);
          stompClient = Stomp.over(socket);
          stompClient.connect({}, function(frame) {
            console.log('Connected to external STOMP server:', frame);
            const connectedFrame = 'CONNECTED\nversion:1.1\nheart-beat:10000,10000\n\n\0';
            ws.send(connectedFrame);
            stompClient.send("/app/vin", HEADER );
            stompClient.send("/app/version", HEADER)
          });
        }
    } else if (command === 'SUBSCRIBE' && stompClient) {
        // Extract the destination from the SUBSCRIBE frame
        const destination = lines.find(line => line.startsWith('destination:')).split(':')[1].trim();
        console.log('Subscribing to:', destination);

        // Subscribe to the destination and set up a callback to handle incoming messages
        
        stompClient.subscribe(destination, function(message) {
            console.log('Message received from subscribed destination:', message);
            let headers = message.headers;
            headers['destination'] = destination; // Ensure the destination header is included
            const messageFrame = constructStompFrame('MESSAGE', headers, message.body);
            ws.send(messageFrame);
            // if (destination === '/user/queue/vin') {
            //     stompClient.send("/app/vin", HEADER );
            //     stompClient.send("/app/version", HEADER);
            //   }
        });

      } else if (stompClient) {
        // For other frames like SEND, ACK, etc., forward them to the external STOMP server
        console.log('Forwarding STOMP frame to external STOMP server:', frameStr);
        stompClient.send(frame);
      }
    } catch (error) {
      console.error('Error handling STOMP frame:', error);
    }
  });

  ws.on('close', function close() {
    console.log('Python app disconnected');
    if (stompClient) {
      stompClient.disconnect();
      stompClient = null;
    }
  });
});
