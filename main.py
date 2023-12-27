import kivy
import stomp
from stomp.adapter.ws import WSTransport
from kivy.app import App
from websocket import create_connection
from kivy.uix.screenmanager import Screen
import threading
import websocket
GLOBAL_VERSION = "V0.0.1"
import requests
import time
DEVELOPER_MODE = 0           # set to 1 to disable all GPIO, temp probe, and obd stuff
STOMP_URI = 'localhost'

from kivy.config import Config
Config.set('graphics', 'width', '800')
Config.set('graphics', 'height', '480')
from kivy.core.window import Window

Window.size = (800, 480)
heart_beat = (10000, 10000)
class MyListener(stomp.ConnectionListener):
    def __init__(self, conn):
        self.conn = conn
        
    def on_message(self, headers, message):
        print(f'Received: {message}')
        
    def on_error(self, frame):
        print(f'Error: {frame}')
    
    def on_connected(self, headers, body):
        print(f'Connected: {headers}')
    
    def on_disconnected(self):
        print('Disconnected')
        # connect_headers = {
        #     'accept-version': '1.1,1.0',
        #     'heart-beat': '10000,10000'
        # }
        # self.conn.connect(with_connect_command=True, headers=connect_headers)
        
    
    def on_heartbeat(self):
        
        print('Heartbeat')
        
    def on_before_message(self, headers, body):
        print('Before message')
        
    def on_receipt(self, headers, body):
        print('Receipt')
class BM3:
    URI = "localhost"
    WS = None
    Connection = None
    Connected = False
    Listener = None

    def connect(self):
        # print(response.text)
        # base_url = "http://10.0.0.2:8080/ws/info"
        # timestamp = int(time.time() * 1000)  # Current time in milliseconds
        # params = {'t': timestamp}

        # # Define the headers from the provided JSON
        # headers = {
        #     # ... (as defined above)
        # }

        # Make the GET request to the SockJS /info endpoint with headers
        # response = requests.get(base_url, params=params, headers=headers)
        # print (response.text)
        # BM3.WS = create_connection("ws://10.0.0.2:8080/ws/220/2n5h500l/websocket",
        header = {
            "Upgrade": "websocket",
            "Connection": "Upgrade",
            "Sec-WebSocket-Version": "13",  # This is the version of WebSocket protocol and is almost always 13.
            # Add other necessary headers like Host, Origin, etc.
        }
       
        BM3.Connection = stomp.Connection([(BM3.URI, 8081)])
        # BM3.Connection.transport = WSTransport([(BM3.URI, 8080)], ws_path='/ws', header=header)
       
        BM3.Listener = MyListener(BM3.Connection)
        BM3.Connection.set_listener('', BM3.Listener)
        
        connect_headers = {
            'accept-version': '1.1,1.0',
            'heart-beat': '10000,10000',
        }
        
        # ws_headers = {
            
        # }

        WS = WSTransport([(BM3.URI, 8081)])
        BM3.Connection.transport = WS
        socket = websocket.create_connection(
                        f"ws://{BM3.URI}:8081/ws")
        BM3.Connection.transport.socket = socket
        # socket.send('123123')
        # WS.socket = socket

        BM3.Connection.connect(headers=connect_headers, wait=True, with_connect_command=True)
        BM3.Connection.subscribe(destination='/user/queue/vin', id=1)
        # BM3.Connection.connect(with_connect_command=True, wait=True)
        # BM3.Connection.('CONNECT', headers=connect_headers)
        # BM3.Connection.send_frame('CONNECT', headers=connect_headers)
        # self.subscribe_vin()
        # BM3.Connected = True

    def disconnect(self):
        BM3.Connection.disconnect()
        BM3.Connected = False
    
    def send(self, message):
        BM3.Connection.send(body=message, destination='/topic/bm3')
        
    def subscribe_vin(self):
        BM3.Connection.subscribe(destination='/user/queue/vin', id='vin', ack='auto')
    
    def subscribe(self):
        BM3.Connection.subscribe(destination='/topic/bm3', id=1, ack='auto')
    
    def unsubscribe(self):
        BM3.Connection.unsubscribe(id=1)
        
    def start(self):
        bm3 = BM3()
        BM3ConnectionThread = threading.Thread(name='bm3_connection_thread', target=bm3.connect)
        BM3ConnectionThread.start()
        

BM3().start()

class MainApp(App):
    def build(self):
        self.screen = Screen()
        pass
    
    
if __name__ =='__main__':
    MainApp().run()
    
    