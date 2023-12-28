import kivy
import stomp
from stomp.adapter.ws import WSTransport
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.uix.floatlayout import FloatLayout
from websocket import create_connection
from kivy.uix.screenmanager import Screen
from kivy.clock import Clock
from payloads import jwt, big_payload
import threading
import websocket
import sys
import os
import socket
import subprocess
import json
from kivy.core.window import Window
from kivy.properties import NumericProperty, StringProperty, ObjectProperty, ListProperty
GLOBAL_VERSION = "V0.0.1"

DEVELOPER_MODE = 1           # set to 1 to disable all GPIO, temp probe, and obd stuff
STOMP_URI = 'localhost'


from kivy.config import Config
Config.set('graphics', 'width', '240')
Config.set('graphics', 'height', '320')
from kivy.core.window import Window
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.properties import ObjectProperty
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
    connect_headers = {
            'accept-version': '1.1,1.0',
            'heart-beat': '10000,10000',
            'jwt': jwt
    }
        
    jwt_headers = {
            'jwt': jwt
    }
        
    app_version_headers = {
            "app-version":	"1.00.000-1"
    }
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
       
        BM3.Connection = stomp.Connection([(BM3.URI, 8080)], auto_content_length=True, )
        # BM3.Connection.transport = WSTransport([(BM3.URI, 8080)], ws_path='/ws', header=header)
       
     
        

        
        # ws_headers = {
            
        # }
        BM3.Listener = MyListener(BM3.Connection)
        BM3.Connection.set_listener('', BM3.Listener)
        WS = WSTransport([(BM3.URI, 8080)])
        BM3.Connection.transport = WS
        socket = websocket.create_connection(
                        f"ws://{BM3.URI}:8081/ws", header=header)
        BM3.Connection.transport.socket = socket
        # socket.send('123123')
        # WS.socket = socket
        # BM3 lis
        

        BM3.Connection.connect(headers=self.connect_headers, wait=True, with_connect_command=True, )
        BM3.Connection.subscribe(destination='/user/queue/version', id=1)
        BM3.Connection.subscribe(destination='/user/queue/id', id=2)
        BM3.Connection.subscribe(destination='/user/queue/vin', id=7)
        BM3.Connection.subscribe(destination='/user/queue/ram', id=8)

        BM3.Connection.subscribe(destination='/queue/dashdata', id=4)
        BM3.Connection.subscribe(destination='/queue/dashstatus', id=5)

        # dict to string
        # json.dumps(dash_1)
        # dict to json
        # json.loads(dash_1)
        # escape double quotes
        # json.dumps(dash_1).replace('"', '\\"')

        BM3.Connection.send(destination='/app/startdash', headers=self.jwt_headers
    , body=json.dumps(big_payload))
        # BM3.Connection.send_frame(cmd="SEND", body=dash_2)
        # BM3.Connection.send_frame(cmd="SEND", body=dash_3)
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
        
    def send_for_vin(self):
        # BM3.Connection.send_frame("SEND\napp-version:1.00.000-1\ndestination:/app/vin\n\n\u0000")
        BM3.Connection.send(destination='/app/vin', headers=BM3.app_version_headers, body="")
        # BM3.Connection.send(destination='/app/ram', headers=BM3.app_version_headers, body="")
        
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

class CustomGauge(FloatLayout):
    label_text = StringProperty('')
    label_font_size = NumericProperty(24)
    gauge_image = StringProperty('')
    gauge_bars = StringProperty('')
    bars_image = None
    gauge_size = NumericProperty(60)
    height = NumericProperty(300)
    width = NumericProperty(300)
    label = None
    gauge = None
    bars_image = None

    def __init__(self, **kwargs):
        super(CustomGauge, self).__init__(**kwargs)
        # self.bind(size=self.update_ui, pos=self.update_ui)

    def on_kv_post(self, base_widget):
        # Create the label with initial position


        # Create the gauge image
        self.gauge = Image(source=self.gauge_image,
                           opacity=1,
                           size_hint=(None, None),
                           pos=(self.pos[0], self.pos[1]),
                           size=(self.gauge_size, self.gauge_size - 20))
        self.add_widget(self.gauge)

        # Create the bars image
        self.bars_image = Image(opacity=1,
                                source=self.gauge_bars,
                                size_hint=(None, None),
                                pos=(self.pos[0], self.pos[1]),
                                size=(self.gauge_size, self.gauge_size - 20))
        self.add_widget(self.bars_image)
        
        self.label = Label(text=self.label_text,
                           font_size=self.gauge_size * 0.17,
                           halign='center',
                           valign='middle',
                          pos=( ((-Window.size[0] / 2) + self.gauge.pos[0] + self.gauge_size / 2),  ((-Window.size[1] / 2) + self.gauge.pos[1] + (self.gauge_size * .05))),
                          size=(self.gauge_size, self.gauge_size)
                           )
        self.add_widget(self.label)
        print(Window.size)
        print(self.gauge.size)
        print(self.gauge.pos)
        print(self.pos)
        print(self.label.pos)
        print("center self", self.center_x, self.center_y)
        print("posss", self.label.pos[0] -  self.gauge.pos[1])
        print("label pos", self.label.pos)

       
        # self.update_ui()  # Initial UI update
        return super().on_kv_post(base_widget)

    def calculate_label_center(self):
        center_x = self.x + self.gauge_size / 2
        center_y = self.y + self.height / 2
        label_width = self.gauge_size
        label_height = self.gauge_size
        pos_x = center_x - label_width / 2
        pos_y = center_y - label_height / 2
        print(pos_x, pos_y)
        return -pos_x, -pos_y

    # def update_ui(self, *args):
    #     label_pos_x, label_pos_y = self.calculate_label_center()
    #     if self.label:
    #         # print(label_pos_x, label_pos_y)
    #         self.label.pos = (label_pos_x, label_pos_y)  # Update label position
    #     if self.gauge:
    #         self.gauge.pos = (self.x, self.y)
    #     if self.bars_image:
    #         self.bars_image.pos = (self.x, self.y)  # Update bars image position

    def on_gauge_bars(self, instance, value):
        if self.bars_image:
            self.bars_image.source = value
            
    def on_label_text(self, instance, value):
        if self.label:
            self.label.text = value

class Gauge1Screen(Screen):
    pass
class InfoScreen(Screen):
    def on_enter(self):
        sys.get_system_info = True
    def on_pre_leave(self):
        sys.get_system_info = False
class MainApp(App):
    def build(self):
        bm3 = BM3
        BM3().start()
        Clock.schedule_interval(self.update_vars, .1)
        Clock.schedule_interval(bm3.send_for_vin, 2)
        Clock.schedule_interval(self.update_vehicle_data, .1)

        
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
    
    