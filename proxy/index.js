const WebSocketServer = require('ws').Server;
const http = require('http');
const Stomp = require('stompjs');
const SockJS = require('sockjs-client');  // Ensure you have sockjs-client installed
const { error } = require('console');

const TEST = true;
const HEADER = {"app-version": "1.00.000-1"};
const ENDPOINT = 'http://localhost:8080/ws'; 

const server = http.createServer();
const wss = new WebSocketServer({ server: server, path: "/ws" });
const testPayload = '"22.987","5822+73","5814+99","5801+0.1","4205+23.9239329","4536+14.8","4AB0+0.0","5805+58","5819+0","5881+0","56C1+-14","56D7+129","580F+61","580E+0.0","4A49+-0.1","4A4A+-0.1","4A4C+-0.1","4A4D+-0.1","4A4E+-0.1","4A4F+-0.1","4A36+0","58F3+72","5807+1.00","582C+10.29","5889+19.11","5804+0.0","5813+63.0","5818+0.0","5812+0.0","580B+0.0","5806+1.00","4600+99","580D+0","4AAB+50","6001CFF8+11.90","60001C0C+-1.349","6000251C+1.000","60002530+1.000","60003648+0.0","60003B56+0.000","60003B58+0.000","60003B5A+0.000","60003B5C+0.000","60003B5E+0.000","60003B60+0.000","6000344C+0.0000","60001CA8+184.84","600031D4+184.8400","50004DC8+0","600017B8+0.00","600017B4+0.00","600017BC+0.00","60003006+0.00","60002E4E+0.000","60002CC4+-35.3","600024DE+3.99993","60038090+0","6003814A+0.00","60038149+0.00","6003814B+0.00","60038096+0","60038140+0","60038141+-40","60038147+0","60038082+0.00","6003808E+0.00","60038084+0.00","60038006+1"'
class StompFrame {
  constructor(command, destination, headers, body) {
    this.destination = destination;
    this.headers = headers;
    this.command = command
    this.body = body;
  }
}

function parseStompFrame(buffer) {
  // Find the end of the header section (double newline)
  const doubleNewlineIndex = buffer.indexOf('\n\n');
  if (doubleNewlineIndex === -1) {
    throw new Error('Invalid STOMP frame: No header-body separator found.');
  }

  // Parse headers
  let headers = {};
  let destination = null;
  let command = null;
  const headerPart = buffer.slice(0, doubleNewlineIndex).toString();
  const headerLines = headerPart.split('\n');
  headerLines.forEach((line) => {
    const [key, value] = line.split(':');
    if (key === 'destination') {
      destination = value;
    } else if (key === 'SEND') {
      command = key;
    } else if (key === 'SUBSCRIBE') {
      command = key;
    } else if (key === 'CONNECT') {
      command = key;
    }
     else if (key) {
      headers[key] = value;
    }
  });

  // Extract the body (assuming it ends with a null byte 0x00)
  let body = null;
  const bodyStartIndex = doubleNewlineIndex + 2; // After '\n\n'
  const nullIndex = buffer.indexOf('\0', bodyStartIndex);
  if (nullIndex !== -1) {
    body = buffer.slice(bodyStartIndex, nullIndex).toString();
  } else {
    throw new Error('Invalid STOMP frame: No null byte terminator for body.');
  }

  return new StompFrame(command, destination, headers, body);
}
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
 
  // ws.on('close', function() {
  //   // Handle disconnect event here
  //   console.log('WebSocket connection closed');
  //   // Add your code to handle the disconnect event
  //   if (stompClient && stompClient.connected) {
  //     stompClient.disconnect();
  //     stompClient = null;
  //   }
  // });

  ws.on('message', function incoming(frame) {
    try {
      const parsedFrame = parseStompFrame(frame);
      console.log('Received STOMP ');
      const frameStr = frame.toString();
      console.log('Command:', parsedFrame.command);
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
          stompClient.reconnect_delay = 1E3;
          stompClient.heartbeat.outgoing = 1E4;
          stompClient.connect({}, function(frame) {
            console.log('Connected to external STOMP server:', frame);
            const connectedFrame = 'CONNECTED\nversion:1.1\nheart-beat:10000,10000\n\n\0';
            ws.send(connectedFrame);
            // stompClient.send("/app/vin", HEADER );
          });

          stompClient.debug = function(str) {
            console.log('STOMP Debug:', str);
            if (str.includes("Whoops! Lost connection to")) {
              if (ws.readyState === 1) {
                const errorFrame = 'ERROR\nmessage:Error connecting to external STOMP server\n\n\0';
                ws.send(errorFrame);
                ws.close();
                stompClient = null;
              }
            }
          };
        }
        // stompClient.send("/app/vin", HEADER );
        // stompClient.send("/app/version", HEADER)
    } else if (command === 'SUBSCRIBE' && stompClient) {
        // Extract the destination from the SUBSCRIBE frame
        const destination = lines.find(line => line.startsWith('destination:')).split(':')[1].trim();
        console.log('Subscribing to:', destination);
        stompClient.subscribe(destination, function(message) {
            console.log('Message received from subscribed destination:', message);
            let headers = message.headers;
            headers['destination'] = destination; // Ensure the destination header is included
            const messageFrame = constructStompFrame('MESSAGE', headers, message.body);
            console.log('messageFrame:', messageFrame)
            ws.send(messageFrame);
            // stompClient.send("/app/vin", HEADER );
            // stompClient.send("/app/version", HEADER);
        }
        );
      }
      
      else if (command === 'SEND' && stompClient) {
        // For other frames like SEND, ACK, etc., forward them to the external STOMP server
        // console.log('frame.destination:', parsedFrame.destination)
        // console.log('frame.headers:', parsedFrame.headers)
        // console.log('frame.body:', parsedFrame.body)
        // get header
        // parse frame string
        
        // check stompClient if connected
        // if not connected, send error frame
        // if connected, send frame to stompClient
        
        stompClient.send(parsedFrame.destination, parsedFrame.headers, parsedFrame.body)
        
        // if (TEST && parsedFrame.destination === '/app/startdash') {
        //   // send /queue/dashdata for 2 seconds every .1 seconds
        //   console.log("SENT Dash")
        //   const test_interval = setInterval(() => {
        //     const messageFrame = constructStompFrame('MESSAGE', {
        //       destination: '/queue/dashdata',
        //     }, testPayload);
        //     ws.send(messageFrame);
        //   }, 200);

        //   setTimeout(() => {
        //     clearInterval(test_interval);
        //   }, 2000);

        // }
      } else if (command === 'NEXT' && stompClient) {
        console.log('CONTINUE frame received from Python app. Ignoring it.')
      
      }
    } catch (error) {
      console.error('Error handling STOMP frame:', error);
    }
  });

  // ws.on('close', function close() {
  //   console.log('Python app disconnected');
  //   if (stompClient) {
  //     stompClient.disconnect();
  //     stompClient = null;
  //   }
  // });
});
