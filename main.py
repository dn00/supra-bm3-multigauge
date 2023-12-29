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
import time
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

class DESTINATIONS:
    CAR_VIN = '/user/queue/vin'
    CAR_DASH_DATA = '/queue/dashdata'
    CAR_STATUS = 'car_status'
class CarDiagData:
    PID = "-1"
    value = 0
    def __init__(self, pid, value = 0):
        self.PID = pid
        self.value = value

class MyListener(stomp.ConnectionListener):
    def __init__(self, conn, callback = None):
        self.conn = conn
        self.callback = callback
        
    def on_message(self, frame):
        print(f'Message: ' + frame.headers['destination'])
        if self.callback:
            if frame.headers['destination'] == DESTINATIONS.CAR_VIN:
                self.callback(DESTINATIONS.CAR_VIN, frame.body)
            elif frame.headers['destination'] == DESTINATIONS.CAR_DASH_DATA:
                self.callback(DESTINATIONS.CAR_DASH_DATA, frame.body)
        # print(f'Message: {headers.destination}, {message}')
        # if self.callback:
        #     self.callback(headers, message)
        
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
        
    # def on_before_message(self, headers, body):
    #     print('Before message')
        
    # def on_receipt(self, headers, body):
    #     print('Receipt')


class BM3:
    URI = "localhost"
    WS = None
    Connection = None
    Connected = True
    Listener = None
    car_data = None
    last_car_data_received = time.time() + 1
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
    
    
    def proxy_callback(self, type, message):
        print('proxy_callback', type, message)
        if type == DESTINATIONS.CAR_VIN:
            # self.handle_car_data(message)
            pass
        elif type == DESTINATIONS.CAR_DASH_DATA:
            self.handle_car_data(message)
    
    def handle_car_data(self, payload):
        split_payload = payload.split(',')
        result_dict = {}
        for i, value in enumerate(split_payload):
            split_value = value.strip('"').split('+')
            if len(split_value) == 2:
                result_dict[split_value[0]] = split_value[1]
            else:
                result_dict[str(i)] = value.strip('"')
        
        BM3.car_data = result_dict
        BM3.last_car_data_received = time.time()
        
    def get_car_data(self, car_diag_object: CarDiagData):
        if self.car_data:
            return self.car_data[car_diag_object.PID]
        return -1
    
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
        # self.WS = create_connection("ws://10.0.0.2:8080/ws/220/2n5h500l/websocket",
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
       
        # self.Connection.transport = WSTransport([(self.URI, 8080)], ws_path='/ws', header=header)

        # ws_headers = {
            
        # }
        BM3.Listener = MyListener(BM3().Connection, callback=self.proxy_callback)
        
        WS = WSTransport([(BM3().URI, 8080)])
        BM3.Connection = stomp.Connection([(BM3.URI, 8080)], auto_content_length=True, )
        
        BM3.Connection.transport = WS
        socket = websocket.create_connection(
                        f"ws://{self.URI}:8081/ws", header=header)
        # self.Connection.set_listener('', self.Listener)
        BM3.Connection.transport.socket = socket
        # socket.send('123123')
        # WS.socket = socket
        # BM3 lis
        
        BM3.Connection.set_listener('', BM3().Listener)

        BM3.Connection.connect(headers=self.connect_headers, wait=True, with_connect_command=True, )
        BM3.Connection.subscribe(destination='/user/queue/version', id=1)
        BM3.Connection.subscribe(destination='/user/queue/id', id=2)
        BM3.Connection.subscribe(destination='/user/queue/vin', id=7)
        BM3.Connection.subscribe(destination='/user/queue/ram', id=8)

        BM3.Connection.subscribe(destination='/queue/dashdata', id=4)
        BM3.Connection.subscribe(destination='/queue/dashstatus', id=5)
        BM3.Connected = True
        

    def disconnect(self):
        self.Connection.disconnect()
        self.Connected = False
    
    def send(self, message):
        self.Connection.send(body=message, destination='/topic/bm3')
    
    def request_car_data(self):
        while True:
            time.sleep(.1)
            if BM3.Connected and BM3.last_car_data_received + .1 < time.time():   
                # self.Connection.send(destination='/app/vin', headers=self.app_version_headers, body="")
                BM3.Connection.send(destination='/app/startdash'
                        , body=json.dumps(big_payload))
    
    def send_for_vin(self):
        # self.Connection.send_frame("SEND\napp-version:1.00.000-1\ndestination:/app/vin\n\n\u0000")
        self.Connection.send(destination='/app/vin', headers=self.app_version_headers, body="")

    def subscribe_vin(self):
        self.Connection.subscribe(destination='/user/queue/vin', id='vin', ack='auto')
    
    def subscribe(self):
        self.Connection.subscribe(destination='/topic/bm3', id=1, ack='auto')
    
    def unsubscribe(self):
        self.Connection.unsubscribe(id=1)
        
    def start(self):
        BM3ConnectionThread = threading.Thread(name='bm3_connection_thread', target=self.connect)
        BM3ConnectionThread.start()
        
    def update_thread(self):
        BM3UpdateThread = threading.Thread(name='bm3_update_thread', target=self.request_car_data)
        print('starting update thread')
        BM3UpdateThread.start()
       
class Car:
    class Data:
        Boost = CarDiagData("4205", 0)
        RPM = CarDiagData("-1", 0)
        Speed = CarDiagData("-1", 0)
        OilTemp = CarDiagData("-1", 0)
        CoolantTemp = CarDiagData("5805", 0)
        IntakeAirTemp = CarDiagData("580F", 0)
        BM3EthanolPercent = CarDiagData("60038096", 0)
        Ign1Timing = CarDiagData("580E", 0)
        AFR = CarDiagData("582C", 0)
        VIN = ''
        
    class gauge:
        class image:
            OilTemp = "data/gauges/normal/s2k_"
            Boost = "data/gauges/normal/s2k_"
            CoolantTemp = "data/gauges/normal/s2k_"
            IntakeTemp = "data/gauges/normal/s2k_"

        class persegment:
            Boost_max = 25
            OilTemp_max = 300
            CoolantTemp_max = 300
            IntakeTemp_max = 300
            Ign1Timing_max = 50
            AFR_max = 50
            
            Boost = round(Boost_max / 32, 2)
            OilTemp = round(OilTemp_max / 32, 2)
            CoolantTemp = round(CoolantTemp_max / 32, 2)
            IntakeTemp = round(IntakeTemp_max / 32, 2)
            Ign1Timing = round(Ign1Timing_max / 32, 2)
            AFR = round(AFR_max / 32, 2)
            
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

class ReadoutGauge(FloatLayout):
    label_text = StringProperty()
    label_unit_text = StringProperty()
    label_font_size = NumericProperty(24)
    # pos = ListProperty()
    size = ListProperty()
    value = StringProperty("0")
    value_size = NumericProperty()
    label_font_name = StringProperty()
    value_font_name = StringProperty()
    def __init__(self, **kwargs):
        super(ReadoutGauge, self).__init__(**kwargs)
    def on_kv_post(self, base_widget):
        self.label = Label(text=self.label_text,
                           bold=True,
                           halign='left',
                           font_size=self.label_font_size,
                           font_name=self.label_font_name,
                              pos=((-Window.size[0] / 2) + self.pos[0], (-Window.size[1] / 2) + self.pos[1]),
                          size=(self.size[0], self.size[1])
        )
        self.readout = Label(text=self.value,
                           font_size=self.value_size,
                            # halign='left',
                            # valign='middle',
                            font_name=self.value_font_name,
                              pos=((-Window.size[0] / 2) + self.pos[0] + 5, (-Window.size[1] / 2) + self.pos[1] - self.label_font_size),
                               size=(self.size[0], self.size[1])
                            )
        self.unit_text = Label(text=self.label_unit_text,
                           font_size=self.label_font_size * 0.5,
                           font_name=self.label_font_name,
                              pos=((-Window.size[0] / 2) + (self.label.width) + self.pos[0] + (len(self.label.text) * 2), (-Window.size[1] / 2) + self.pos[1] + self.label.height - 4 ),
                          size=(self.size[0], self.size[1]))
        self.add_widget(self.readout)
        self.add_widget(self.unit_text)
        self.add_widget(self.label)
        print((-Window.size[0] / 2) + self.label.size[0] + self.size[0])

        return super().on_kv_post(base_widget)
    
    def on_value(self, instance, value):
        if self.label:
            self.readout.text = value
class CustomGauge(FloatLayout):
    label_text = StringProperty('')
    label_font_size = NumericProperty(24)
    label_unit_text = StringProperty('')
    gauge_image = StringProperty('')
    gauge_bars = StringProperty('')
    gauge_size = NumericProperty(60)
    height = NumericProperty(0)
    width = NumericProperty(0)
    label = None
    gauge = None
    bars_image = None
    label_unit = None

    def __init__(self, **kwargs):
        super(CustomGauge, self).__init__(**kwargs)
        # self.bind(size=self.update_ui, pos=self.update_ui)

    def on_kv_post(self, base_widget):
        # Create the label with initial position
        
        self.height = self.gauge_size 
        self.width = self.gauge_size * 1.5

        # Create the gauge image
        self.gauge = Image(source=self.gauge_image,
                           opacity=1,
                           size_hint=(None, None),
                           pos=(self.pos[0], self.pos[1] + (self.pos[1] - self.height) / 2),
                           size=(self.width, self.height))
        
        self.add_widget(self.gauge)

        # Create the bars image
        self.bars_image = Image(opacity=1,
                                source=self.gauge_bars,
                                size_hint=(None, None),
                                pos=(self.pos[0],  self.pos[1] + (self.pos[1] - self.height) / 2),
                                size=(self.width, self.height))
        
        self.add_widget(self.bars_image)
        
        self.label = Label(text=self.label_text,
                           font_size=self.gauge_size * 0.25,
                           halign='center',
                           valign='middle',
                          pos=( ((-Window.size[0] / 2) + self.gauge.pos[0] + self.width / 2),  ((-Window.size[1] / 2) + self.gauge.pos[1] - (self.height * .05))),
                          size=(self.width, self.height)
                           )
        self.add_widget(self.label)
        if (self.label_unit_text != ''):
            print('sadasdad')
            self.label_unit = Label(text=self.label_unit_text,
                            font_size=self.gauge_size * 0.1,
                            halign='center',
                            valign='middle',
                            pos=( ((-Window.size[0] / 2) + self.gauge.pos[0] + self.width / 2), ((-Window.size[1] / 2)  + self.gauge.pos[1] + (self.height * .4))),
                            size=(self.width, self.height)
                            )
            
            self.add_widget(self.label_unit)
       
        # self.update_ui()  # Initial UI update
        return super().on_kv_post(base_widget)

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


BM3().start()
BM3().update_thread()
class MainApp(App):
    def build(self):
        # self.bm3 = BM3()
        # BM3ConnectionThread = threading.Thread(name='bm3_connection_thread', target=BM3().connect)
        # BM3ConnectionThread.start()
        Clock.schedule_interval(self.update_vars, 1)
        # Clock.schedule_interval(bm3.send_for_vin, 5)
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
    Boost = NumericProperty(0)
    RPM = NumericProperty(0)
    CoolantTemp = NumericProperty(0)
    OilTemp = NumericProperty(0)
    IntakeAirTemp = NumericProperty(0)
    BM3EthanolPercent = NumericProperty(0)
    Ign1Timing = NumericProperty(0)
    AFR = NumericProperty(0)
    
    # Gauge Bar Images
    OilTemp_Image = StringProperty()
    Boost_image = StringProperty()
    CoolantTemp_Image = StringProperty()
    IntakeTemp_Image = StringProperty()
    Ign1Timing_Image = StringProperty()
    AFR_Image = StringProperty()
    
    def update_vars(self, *args):
        self.TempUnit = sys.TempUnit
        self.ipAddress = sys.ip
        if sys.get_system_info == True:
            self.get_IP()
    
    def update_vehicle_data(self, *args):
       
        self.Boost = BM3().get_car_data(Car.Data.Boost)
        self.IntakeAirTemp = BM3().get_car_data(Car.Data.IntakeAirTemp)
        self.BM3EthanolPercent = BM3().get_car_data(Car.Data.BM3EthanolPercent)
        self.RPM = Car.Data.RPM.value
        self.CoolantTemp = BM3().get_car_data(Car.Data.CoolantTemp)
        self.Ign1Timing = BM3().get_car_data(Car.Data.Ign1Timing)
        self.AFR = float(BM3().get_car_data(Car.Data.AFR))
        self.OilTemp = Car.Data.OilTemp.value
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
            
        if 0 <= int(round(self.Boost/Car.gauge.persegment.Boost)) <= 32:
            self.Boost_image = str(Car.gauge.image.Boost+(str(int(round(self.Boost/Car.gauge.persegment.Boost))))+'.png')
        if 0 <= int(round(self.CoolantTemp/Car.gauge.persegment.CoolantTemp)) <= 32:
            self.CoolantTemp_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.CoolantTemp/Car.gauge.persegment.CoolantTemp))))+'.png')
        if 0 <= int(round(self.OilTemp/Car.gauge.persegment.OilTemp)) <= 32:
            self.OilTemp_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.OilTemp/Car.gauge.persegment.OilTemp))))+'.png')
        if 0 <= int(round(self.Ign1Timing/Car.gauge.persegment.Ign1Timing)) <= 32:
            self.Ign1Timing_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.Ign1Timing/Car.gauge.persegment.Ign1Timing))))+'.png')
        if 0 <= int(round(self.AFR/Car.gauge.persegment.AFR)) <= 32:
            self.AFR_Image = str('data/gauges/normal/s2k_'+(str(int(round(self.AFR/Car.gauge.persegment.AFR))))+'.png')
    
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
    
    