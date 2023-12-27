const Stomp = require('stompjs');
const SockJS = require('sockjs-client');

let App = {};
App.init = function () {
    let stompClient = null;
    let vin = null; // Assume VIN is set or obtained elsewhere
    let sigValid = false;

    function connect() {
        let headersObj = { "app-version": "1.00.000-1" };
        let socket = new SockJS('http://localhost:8080/ws');
        stompClient = Stomp.over(socket);
        stompClient.debug = null; // Disable console logging for a cleaner headless operation

        stompClient.connect(headersObj, function (frame) {
            console.log('Connected: ' + frame);
            stompClient.send("/app/vin", headersObj );
            stompClient.send("/app/version", headersObj);
            // stompClient.subscribe('/user/queue/vin', function (fpResp) {
            //     let resp = JSON.parse(fpResp.body);
            //     console.log('Message Received: ', resp);
            //     // Process response here
            //     // ...

            //     if (resp.percentDone === 100) {
            //         // Disconnect after receiving the complete response
            //         disconnect();
            //     }
            // });

            // Send a message or make a subscription if needed
            // stompClient.send("/app/someEndpoint", {}, JSON.stringify({ 'key': 'value' }));
        });
    }

    function disconnect() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        console.log("Disconnected");
    }

    connect(); // Initiate the connection
};

App.init();