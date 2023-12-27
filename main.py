import kivy
import stomp
from stomp.adapter.ws import WSTransport
from kivy.app import App
from websocket import create_connection
from kivy.uix.screenmanager import Screen
from kivy.clock import Clock
import threading
import websocket
import sys
import os
import socket
import subprocess
from kivy.properties import NumericProperty, StringProperty, ObjectProperty, ListProperty
GLOBAL_VERSION = "V0.0.1"

DEVELOPER_MODE = 1           # set to 1 to disable all GPIO, temp probe, and obd stuff
STOMP_URI = 'localhost'


from kivy.config import Config
Config.set('graphics', 'width', '240')
Config.set('graphics', 'height', '320')
from kivy.core.window import Window
Window.size = (240, 320)

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
                "Accept": "*/*",
                        "Accept-Encoding": "gzip, deflate, br",
                        "Accept-Language": "en-US,en;q=0.5",
                        "Cache-Control": "no-cache",
                        "Connection": "keep-alive, Upgrade",
                        "Host": "172.29.96.2:8080",
                        "Origin": "http://172.29.96.1:8181",
                        "Pragma": "no-cache",
                        "Sec-Fetch-Dest": "empty",
                        "Sec-Fetch-Mode": "websocket",
                        "Sec-Fetch-Site": "same-site",
                        # "Sec-WebSocket-Extensions": "permessage-deflate",
                        "Sec-WebSocket-Version": "13",
                        # "Upgrade": "websocket",
                        # "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0"
                                
            # This is the version of WebSocket protocol and is almost always 13.
            # Add other necessary headers like Host, Origin, etc.
        }
       
        BM3.Connection = stomp.Connection([(BM3.URI, 8080)])
        # BM3.Connection.transport = WSTransport([(BM3.URI, 8080)], ws_path='/ws', header=header)
       
        BM3.Listener = MyListener(BM3.Connection)
        BM3.Connection.set_listener('', BM3.Listener)
        
        connect_headers = {
            'accept-version': '1.1,1.0',
            'heart-beat': '10000,10000',
        }
        
        # ws_headers = {
            
        # }

        WS = WSTransport([(BM3.URI, 8080)])
        BM3.Connection.transport = WS
        socket = websocket.create_connection(
                        f"ws://{BM3.URI}:8081/ws", header=header)
        BM3.Connection.transport.socket = socket
        # socket.send('123123')
        # WS.socket = socket

        BM3.Connection.connect(headers=connect_headers, wait=True, with_connect_command=True)
        BM3.Connection.subscribe(destination='/user/queue/version', id=1)
        BM3.Connection.subscribe(destination='/user/queue/id', id=2)

        BM3.Connection.subscribe(destination='/user/queue/vin', id=3)
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

class Car:
    class Data:
        RPM = 0
        Speed = 0
        OilTemp = 100
        CoolantTemp = 50
        IntakeTemp = 0
        VIN = ''
        
    class gauge:
        class image:
            OilTemp = "data/gauges/normal/S2K_0.png"
            CoolantTemp = "data/gauges/normal/S2K_0.png"
            IntakeTemp = "data/gauges/normal/S2K_0.png"

        class persegment:
            OilTemp_max = 300
            CoolantTemp_max = 300
            IntakeTemp_max = 300

            OilTemp = round(OilTemp_max / 32)
            CoolantTemp = round(CoolantTemp_max / 32)
            IntakeTemp = round(IntakeTemp_max / 32)
            
    class dev:  # used for development of GUI and testing
        Speed = 0
        Speed_inc = 1
        RPM = 0
        RPM_inc = 1
        CoolantTemp = 0
        CoolantTemp_inc = 1
        OilTemp = 0
        OilTemp_inc = 1
        FuelTrim = 0
        FuelTrim_inc = 1
        Generic = 0
        Generic_inc = 1
class sys:
    version = GLOBAL_VERSION
    ip = "No IP address found..."
    ssid = "No SSID found..."
    CPUTemp = 0
    CPUVolts = 0
    get_system_info = False
    screen = 1
    brightness = 0
    shutdownflag = 0
    TempUnit = "F"
    SpeedUnit = "MPH"

    def setbrightness(self, value):
        self.brightness = value
        brightset = 'sudo bash -c "echo ' + str(sys.brightness) + ' > /sys/class/backlight/rpi_backlight/brightness"'
        os.system(brightset)

    # def loaddata(self):
    #     f = open('savedata.txt', 'r+')  # read from text file
    #     OBD.warning.RPM = int(f.readline())
    #     OBD.warning.Speed = int(f.readline())
    #     OBD.warning.CoolantTemp = int(f.readline())
    #     OBD.warning.IntakeTemp = int(f.readline())
    #     OBD.warning.LTFT = int(f.readline())
    #     OBD.warning.STFT = int(f.readline())
    #     sys.TempUnit = f.readline().rstrip()
    #     sys.SpeedUnit = f.readline().rstrip()
    #     f.close()

    # def savedata(self):
    #     f = open('savedata.txt', 'r+')
    #     f.truncate()  # wipe everything
    #     f.write(
    #         str(OBD.warning.RPM) + "\n" +
    #         str(OBD.warning.Speed) + "\n" +
    #         str(OBD.warning.CoolantTemp) + "\n" +
    #         str(OBD.warning.IntakeTemp) + "\n" +
    #         str(OBD.warning.LTFT) + "\n" +
    #         str(OBD.warning.STFT) + "\n" +
    #         sys.TempUnit + "\n" +
    #         sys.SpeedUnit
    #     )
    #     f.close()

class Gauge1Screen(Screen):
    pass
class InfoScreen(Screen):
    def on_enter(self):
        sys.get_system_info = True
    def on_pre_leave(self):
        sys.get_system_info = False
class MainApp(App):
    def build(self):
        Clock.schedule_interval(self.update_vars, .1)
        Clock.schedule_interval(self.update_vehicle_data, .01)

        
    TempUnit = StringProperty()
    # SpeedUnit = StringProperty()
    ipAddress = StringProperty()
    WifiNetwork = StringProperty()
    CPUTemp = StringProperty()
    CPUVoltage = StringProperty()
    shutdownFlag = NumericProperty()
    VIN = StringProperty()

    # Vehicle
    RPM = NumericProperty()
    CoolantTemp = NumericProperty()
    OilTemp = NumericProperty()
    IntakeTemp = NumericProperty()
    
    OilTemp_Image = StringProperty()
    CoolantTemp_Image = StringProperty()
    IntakeTemp_Image = StringProperty()
    
    OilTemp_Max = Car.gauge.persegment.OilTemp_max


    def update_vars(self, *args):
        self.TempUnit = sys.TempUnit
        self.ipAddress = sys.ip
        if sys.get_system_info == True:
            self.get_IP()
    
    def update_vehicle_data(self, *args):
        self.RPM = Car.Data.RPM
        self.CoolantTemp = Car.Data.CoolantTemp
        self.OilTemp = Car.Data.OilTemp
        self.IntakeTemp = Car.Data.IntakeTemp
        self.VIN = Car.Data.VIN

        if DEVELOPER_MODE == 1:
        # increase up and down coolant temp
            if Car.dev.OilTemp_inc == 1:
                Car.dev.OilTemp = Car.dev.OilTemp + 1
            else:
                Car.dev.OilTemp = Car.dev.OilTemp - 1
            if Car.dev.OilTemp > 300:
                Car.dev.OilTemp_inc = 0
            if Car.dev.OilTemp < 1:
                Car.dev.OilTemp_inc = 1
            self.OilTemp = Car.dev.OilTemp
            

        # if 0 <= int(round(Car.Data.CoolantTemp/Car.gauge.persegment.CoolantTemp)) <= 32:
        #     self.CoolantTemp_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.CoolantTemp/Car.gauge.persegment.CoolantTemp))))+'.png')
        if 0 <= int(round(self.OilTemp/Car.gauge.persegment.OilTemp)) <= 32:
            self.OilTemp_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.OilTemp/Car.gauge.persegment.OilTemp))))+'.png')
    
    def get_IP(self):
        if DEVELOPER_MODE == 0:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
                s.connect(("8.8.8.8", 80))
                sys.ip = s.getsockname()[0]
            except:
                sys.ip = "No IP address found..."
                print("Could not get IP")
            try:
                ssidstr = str(subprocess.check_output("iwgetid -r", shell=True))
                sys.ssid = ssidstr[2:-3]
            except:
                sys.ssid = "No SSID found..."
                print("Could not get SSID")

        self.ipAddress = sys.ip
        self.WifiNetwork = sys.ssid
      
if __name__ =='__main__':
    MainApp().run()
    
    