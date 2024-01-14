from kivymd.app import MDApp
import stomp
from kivymd.theming import ThemeManager
from stomp.adapter.ws import WSTransport
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivymd.uix.button.button import MDFlatButton
from kivymd.uix.chip import MDChip
from kivy.metrics import dp
from kivy.uix.floatlayout import FloatLayout
from kivy.animation import Animation
from kivy.uix.screenmanager import Screen, FadeTransition
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
from kivy.app import App
from kivy.uix.widget import Widget
from kivy.graphics import Color, Rectangle
from kivymd.uix.chip import MDChip, MDChipText
from kivymd.uix.menu import MDDropdownMenu
from kivy.properties import NumericProperty, StringProperty, BooleanProperty, ListProperty, ReferenceListProperty
from kivymd.uix.slider import MDSlider
import weakref
import re
import os
from  histo_gauge import HistoGauge
GLOBAL_VERSION = "V0.0.1"

DEVELOPER_MODE = 1           # set to 1 to disable all GPIO, temp probe, and obd stuff
STOMP_URI = 'localhost'


from kivy.config import Config
Config.set('graphics', 'width', '480')
Config.set('graphics', 'height', '800')
Config.set('graphics', 'show_cursor', 0)

from kivy.core.window import Window
Window.show_cursor = False

from kivy.core.window import Window
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.label import Label
from kivy.uix.image import Image
from kivy.properties import ObjectProperty
Window.size = (480, 800)

heart_beat = (10000, 10000)

class DESTINATIONS:
    CAR_VIN = '/user/queue/vin'
    CAR_DASH_DATA = '/queue/dashdata'
    MAP_SWITCHED = '/user/queue/mapsw'
    IDS = '/user/queue/ids'
    ID = '/user/queue/id'
    RBURBLE = '/user/queue/rburble'
    CAR_STATUS = 'car_status'
    DISCONNECTED = 'disconnected'
    CONNECTED = 'connected'
    CONNECTION_ERROR = 'connection_error'
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
            elif frame.headers['destination'] == DESTINATIONS.MAP_SWITCHED:
                self.callback(DESTINATIONS.MAP_SWITCHED, frame.body)
            elif frame.headers['destination'] == DESTINATIONS.ID or frame.headers['destination'] == DESTINATIONS.IDS:
                self.callback(DESTINATIONS.ID, frame.body)
            elif frame.headers['destination'] == DESTINATIONS.RBURBLE:
                self.callback(DESTINATIONS.RBURBLE, frame.body)
        # print(f'Message: {headers.destination}, {message}')
        # if self.callback:
        #     self.callback(headers, message)
        
    def on_error(self, frame):
        print(f'Error: {frame}')
        if self.callback:
            self.callback(DESTINATIONS.CONNECTION_ERROR, None)
    
    def on_connected(self, headers):
        self.callback(DESTINATIONS.CONNECTED, None)
    
    def on_disconnected(self):
        print('Disconnected')
        self.callback(DESTINATIONS.DISCONNECTED, None)
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
    _instance = None  # Class attribute to hold the single instance

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super(BM3, cls).__new__(cls, *args, **kwargs)
        return cls._instance
    
    BM3UpdateThread = None
    request_data_lock = threading.Lock()  # Lock for the request_car_data method
    URI = "localhost"
    WS = None
    Connection = None
    
    Connected = False
    Connecting = False
    Receiving_Data = False
    isRequestingAdjustment = False
    
    Listener = None
    car_data = None
    
    current_map = "-1"
    custom_rom = False
    current_burble_enabled = False
    current_burble_agg_value = -1.0
    current_burble_dur_value = -1.0
    current_burble_status = False
    
    
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
        print(f"Proxy callback triggered with type: {type}")

        if type == DESTINATIONS.CAR_DASH_DATA:
            self.Receiving_Data = True
            self.handle_car_data(message)
        elif type == DESTINATIONS.MAP_SWITCHED:
            self.handle_map_switched(message)
        elif type == DESTINATIONS.ID or type == DESTINATIONS.IDS:
            self.handle_ids(message)
        elif type == DESTINATIONS.RBURBLE:
            self.handle_rburble(message)
        elif type == DESTINATIONS.CONNECTED:
            print('Connected to the server successfully.')
            self.Connected = True
            self.Connecting = False
            self.subscribe_to_queues()

        elif type == DESTINATIONS.DISCONNECTED:
            print('Disconnected from the server.')
            self.Receiving_Data = False
            if self.Connected:  
                self.Connected = False
                self.Connection = None
                # time.sleep(2) 
                # self.start()

        elif type == DESTINATIONS.CONNECTION_ERROR:
            print('Connection error encountered.')
            self.Receiving_Data = False
            if self.Connected:
                self.Connected = False
                self.Connection = None
                # time.sleep(2)
                # self.start()
    
    def handle_ids(self, message):
        data = json.loads(message)
        if data:
            self.custom_rom = data.get('crom', False)
    
    def handle_car_data(self, payload):
        result_dict = {}
        pattern = r'"(\w+)\+(-?\d+\.\d+|-?\d+)'

        matches = re.findall(pattern, payload)
        for key, value in matches:
            result_dict[key] = float(value) if '.' in value else int(value)

        self.car_data = result_dict
        self.last_car_data_received = time.time()
        
    def handle_map_switched(self, message):
        data = json.loads(message)
        if data:
            slot = data.get('slot', "-1")
            if len(slot) > 0:
                self.current_map = data.get('slot', "-1")
    
    def handle_rburble(self, message):
        data = json.loads(message)
        if data:
            self.current_burble_enabled = data.get('enabled', False)
            self.current_burble_agg_value = float(data.get('agg', -1.0))
            self.current_burble_dur_value = float(data.get('dur', -1.0))
            self.current_burble_status = data.get('status', False)
        
    def get_car_data(self, car_diag_object: CarDiagData):
        if self.car_data:
            raw_value = self.car_data.get(car_diag_object.PID, 0)
            if isinstance(raw_value, float):
                # Limit the value to 2 decimal places using multiplication and integer casting
                return int(raw_value * 100) / 100.0
            else:
                return raw_value
        return 0

    
    def subscribe_to_queues(self):
        self.Connection.subscribe(destination='/user/queue/version', id=1)
        self.Connection.subscribe(destination='/user/queue/ids', id=2)
        self.Connection.subscribe(destination='/user/queue/id', id=3)
        self.Connection.subscribe(destination='/user/queue/vin', id=7)
        self.Connection.subscribe(destination='/user/queue/ram', id=8)
        self.Connection.subscribe(destination='/user/queue/mapsw', id=11)
        self.Connection.subscribe(destination='/user/queue/rburble', id=15)


        self.Connection.subscribe(destination='/queue/dashdata', id=4)
        self.Connection.subscribe(destination='/queue/dashstatus', id=5)
        
        self.Connection.send(destination='/app/startdash', body=json.dumps(big_payload))
        

    def connect(self):
            if self.Connecting:
                # If already attempting to connect, do not start another attempt.F
                print("Connection attempt is already in progress.")
                return

            backoff_time = 1  # Start with a 1 second backoff time
            max_backoff_time = 3  # Maximum backoff time

            while not self.Connection or not self.Connection.is_connected():
                try: 
                        self.Connecting = True
                    
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
                                                    
                            }
                        

                        self.Listener = MyListener(self.Connection, callback=self.proxy_callback)
                            
                        WS = WSTransport([(self.URI, 8080)])
                        self.Connection = stomp.Connection([(self.URI, 8080)], auto_content_length=True, )
                
                        self.Connection.transport = WS
                        socket = websocket.create_connection(
                                            f"ws://{self.URI}:8081/ws", header=header)
                        self.Connection.transport.socket = socket
                    
                        self.Connection.set_listener('', self.Listener)
                        self.Connection.connect(headers=self.connect_headers, wait=True, with_connect_command=True)
                        self.Connecting = False

                        time.sleep(2)
                except Exception as e:
                    print(f"Connection failed: {e}")
                    # Incremental backoff
                    backoff_time = min(backoff_time * 2, max_backoff_time)

                finally:
                    self.Connecting = False
                    time.sleep(backoff_time)  # Backoff before retrying
                    
    def connect_2(self):
            if self.Connecting:
                # If already attempting to connect, do not start another attempt.
                print("Connection attempt is already in progress.")
                return
            try: 
                self.Connecting = True
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
                                                    
                    }
                        

                self.Listener = MyListener(self.Connection, callback=self.proxy_callback)
                            
                WS = WSTransport([(self.URI, 8080)])
                self.Connection = stomp.Connection([(self.URI, 8080)], auto_content_length=True, )
                
                self.Connection.transport = WS
                socket = websocket.create_connection(
                                            f"ws://{self.URI}:8081/ws", header=header)
                self.Connection.transport.socket = socket
                    
                self.Connection.set_listener('', self.Listener)
                self.Connection.connect(headers=self.connect_headers, wait=True, with_connect_command=True)
                self.Connecting = False
            except Exception as e:
                print(f"Connection failed: {e}")

            finally:
                self.Connecting = False

                    
    def disconnect(self):
        self.Connection.disconnect()
        self.Connected = False
    
    def send(self, message):
        pass
        # self.Connection.send(body=message, destination='/topic/bm3')
        
    
    def request_car_data(self):
        while True:
            if not self.Receiving_Data:
                try:
                    # print("Restarting BM3 agent...")
                    # App.get_running_app().kill_bm3_agent()
                    # time.sleep(2)
                    # App.get_running_app().start_bm3_agent()
                    self.connect()
                except Exception as e:
                    print(f"Error restarting BM3 agent: {e}")
            time_since_last_data = time.time() - self.last_car_data_received
            if time_since_last_data > 10:
                self.Receiving_Data = False
            if self.Connected and not self.isRequestingAdjustment:
                with self.request_data_lock:
                    try:
                        self.Connection.send(destination='/app/startdash', body=json.dumps(big_payload))
                        time.sleep(4) 
                    except Exception as e:
                        # stop the thread if the connection is lost
                        # break
                        time.sleep(2)
            else:
                time.sleep(0.2)
        # backoff_time = 0.1  # Initial backoff time
        # max_backoff_time = 3 # Maximum backoff time
        # pause_threshold = 0.3  # Adjust this value based on the server's response time
        # while True:
        #     current_time = time.time()
        #     time_since_last_data = current_time - self.last_car_data_received

        #     if self.Connected and time_since_last_data > pause_threshold:
        #         with self.request_data_lock:
        #             if time.time() - self.last_car_data_received > pause_threshold:
        #                 try:
        #                     self.Connection.send(destination='/app/startdash', body=json.dumps(big_payload))
        #                     self.last_car_data_received = time.time()
        #                     time.sleep(backoff_time) 
                        
        #                     backoff_time = min(backoff_time * 3, max_backoff_time)
        #                 except Exception as e:
        #                     # stop the thread if the connection is lost
        #                     # break
        #                     time.sleep(2)
        #     else:
        #         backoff_time = 0.1
        #         time.sleep(0.1)  # Adjust the sleep time as needed.
        
    def send_for_ids(self):
        if not self.Connected: return
        self.Connection.send(destination='/app/ids', headers=self.jwt_headers, body={})
        self.Connection.send(destination='/app/id', headers=self.jwt_headers, body={})
        
    def send_for_rburble(self):
        if not self.Connected: return
        
        self.Connection.send(destination='/app/rburble', headers=self.jwt_headers, body={})
        
    def send_map_switch(self, map: str = ""):
        if not self.Connected: return
        if not self.custom_rom:
            return
        # if not map == "0" or not map == "3" or map == "":
        #     # Can't use map 1 or 2 any way
        #     return
        self.Connection.send(destination='/app/mapsw', headers=self.jwt_headers, body=json.dumps({"slot": map}))
        
    def send_for_stop_dash(self):
        if not self.Connected: return
        self.Connection.send(destination='/app/stopdash', headers=self.jwt_headers, body={})
        
    def send_live_adjust_burble(self, value: float):
        if not self.custom_rom or not self.Connected:
            return
        if not -1 <= value <= 12:
            return
        self.isRequestingAdjustment = True
        self.last_car_data_received = time.time()
        payload = {
            "enabled": True,
            "agg": value,
            "dur": 0
        }
        if 0 > value:
            payload['agg'] = 0
            payload['enabled'] = False
        self.send_for_stop_dash()
        while True:
            time_since_last_data = time.time() - self.last_car_data_received
            if time_since_last_data > 1:
                # self.send_map_switch(self.current_map if self.current_map != "-1" else "")
                # time.sleep(1)
                
                self.Connection.send(destination='/app/burble', headers=self.jwt_headers, body=json.dumps(payload))
                self.current_burble_agg_value = -1
                self.send_map_switch(self.current_map if self.current_map != "-1" else "")
                self.current_map = "-1"
                break
        
        self.isRequestingAdjustment = False

    def send_for_vin(self):
        if not self.Connected: return

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
        self.BM3UpdateThread = threading.Thread(name='bm3_update_thread', target=self.request_car_data)
        self.BM3UpdateThread.start()
       
class Car:
    class Data:
        AcceleratorPosition = CarDiagData("5814", 0)
        ThrottleAngle = CarDiagData("4600", 0)
        Boost = CarDiagData("4205", 0)
        RPM = CarDiagData("5819", 0)
        Speed = CarDiagData("-1", 0)
        OilTemp = CarDiagData("5822", 0)
        CoolantTemp = CarDiagData("5805", 0)
        IntakeAirTemp = CarDiagData("580F", 0)
        BM3EthanolPercent = CarDiagData("60038096", 0)
        Ign1Timing = CarDiagData("580E", 0)
        AFR = CarDiagData("582C", 0)
        STFT = CarDiagData("5806", 0)
        LTFT = CarDiagData("5807", 0)
        VIN = ''
        
    class gauge:
        class image:
            OilTemp = "data/gauges/normal/s2k_"
            Boost = "data/gauges/normal/s2k_"
            CoolantTemp = "data/gauges/normal/s2k_"
            IntakeTemp = "data/gauges/normal/s2k_"

        class persegment:
            Boost_max = 23
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
    ip = ""
    ssid = ""
    CPUTemp = 0
    CPUVolts = 0
    get_system_info = False
    screen = 1
    brightness = 0
    shutdownflag = 0
    TempUnit = "F"
    SpeedUnit = "MPH"
    NetworkConnected = False

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
    label_font_size = NumericProperty(28)
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
                           font_size=self.label_font_size * 0.4,
                           font_name=self.label_font_name,
                              pos=((-Window.size[0] / 2)  + self.pos[0] + (len(self.label.text) * 8) + (len(self.label_unit_text) * 5), (-Window.size[1] / 2) + self.pos[1] + self.label.height - 4 ),
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
    label_as_icon = BooleanProperty(False)
    label = None
    gauge = None
    bars_image = None
    label_unit = None

    def __init__(self, **kwargs):
        super(CustomGauge, self).__init__(**kwargs)
        # self.bind(size=self.update_ui, pos=self.update_ui)

    def on_kv_post(self, base_widget):
        # Create the label with initial position
        
        self.height = self.gauge_size * 0.8
        self.width = self.gauge_size * 1.5

        # Create the gauge image
        self.gauge = Image(source=self.gauge_image,
                           opacity=1,
                           size_hint=(None, None),
                           pos=(self.pos[0], self.pos[1] + (self.pos[1] - self.height) / 2),
                           size=(self.width, min(self.height, self.gauge_size *0.5)))
        
        self.add_widget(self.gauge)

        # Create the bars image
        self.bars_image = Image(opacity=1,
                                source=self.gauge_bars,
                                size_hint=(None, None),
                                pos=(self.pos[0],  self.pos[1] + (self.pos[1] - self.height) / 2),
                                size=(self.width, min(self.height, self.gauge_size *0.5)))
        
        self.add_widget(self.bars_image)
        
        self.label = Label(text=self.label_text,
                           font_size=self.gauge_size * 0.25,
                           halign='center',
                           valign='middle',
                          pos=( ((-Window.size[0] / 2) + self.gauge.pos[0] + self.width / 2),  ((-Window.size[1] / 2) +  self.gauge.pos[1] - (self.height * .15))),
                          size=(self.width, self.height)
                           )
        self.add_widget(self.label)
        if (self.label_unit_text != ''):
            pos_x =  ((-Window.size[0] / 2) + self.gauge.pos[0] + self.width / 2)
            pos_y = ((-Window.size[1] / 2)  + self.gauge.pos[1] + (self.height * .25))
            if self.label_as_icon:
                pos_y = pos_y - (self.gauge_size * 0.1)
            self.label_unit = Label(text=self.label_unit_text,
                            font_size=self.gauge_size * 0.05,
                            bold=self.label_as_icon,
                            halign='center',
                            valign='middle',
                            pos=(pos_x, pos_y),
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
    def on_touch_down(self, touch):
        super(Gauge1Screen, self).on_touch_down(touch)
        app = App.get_running_app()
        app.rpm_zero_time = None
        
class StartScreen(Screen):
    def on_enter(self, *args):
        app = App.get_running_app()
        app.stop()
        # if BM3().BM3UpdateThread:
        #     # stop thread
        #     BM3().BM3UpdateThread.join()
        BM3().send_for_stop_dash()
        return super().on_enter(*args)
    def transition_to_main_app(self):
        print("Starting auxiliary apps and initializing the main app...")
        app = App.get_running_app()
        app.rpm_zero_time = None
        app.start_bm3_agent()
        # BM3().start()
        BM3().update_thread()
        app.start()
        self.manager.current = 'gauge1'

class InfoScreen(Screen):
    def on_enter(self):
        sys.get_system_info = True
    def on_pre_leave(self):
        sys.get_system_info = False

# class BlackBackgroundWidget(Widget):
#     def __init__(self, **kwargs):
#         super(BlackBackgroundWidget, self).__init__(**kwargs)
#         with self.canvas.before:
#             Color(0, 0, 0, 1)  # Set the color to black (r, g, b, a)
#             self.rect = Rectangle(size=self.size, pos=self.pos)

#         self.bind(size=self._update_rect, pos=self._update_rect)

#     def _update_rect(self, instance, value):
#         self.rect.size = instance.size
class StatusChip(MDChip):
    chip_text = StringProperty("")
    active = BooleanProperty(False)
    failed = BooleanProperty(False)  # Add a failed attribute 
    failed_color = ListProperty([1, 0, 0, 1])  # Default to red
    def __init__(self, **kwargs):
        super(StatusChip, self).__init__(**kwargs)
        self.label = MDChipText(
                    theme_text_color= "Custom",
                    text=self.chip_text,
                    # md_bg_color=[0, 0, 0, 0],  # Fully transparent background
                    # font_size=dp(12),
                    line_width = self.line_width,
                    text_color = [.16, .67, .27, 1],  # Green line color
                )
        self.add_widget(self.label)
        self.pos_hint = {"x": 0.01, "center_y": 0.5}
        self.md_bg_color = [0,0, 0, 1]  # Fully transparent background
        self.line_color = [.16, .67, .27, 1]  # Green line color
        self.size_hint = (None, None)
        self.width = dp(42)  # Starting width, adjust as needed
        self.line_width = 1
        self.check = False  # Set to False if you don't want the check icon
        self.padding = [dp(12), 0, dp(12), 0]  # Horizontal padding

    def on_chip_text(self, instance, value):
        self.label.text = value
        self.label.font_size = dp(18)
        


    def animate_colors(self, active_value):
        # Define the colors for pulsing
        neon_green = [.16, .67, .27, 1]
        orange = [1, 0.5, 0, 1]
        if active_value:
            # Pulse the background, text, and line colors
            # self.animate_color_pulse(self, 'md_bg_color', green, yellow)
            self.animate_color_pulse(self.label, 'text_color', neon_green, orange)
            self.animate_color_pulse(self, 'line_color', neon_green, orange)
        else:
            # Stop pulsing and revert to default colors
            Animation.cancel_all(self, self.label)
            self.md_bg_color = [0, 0, 0, 1]  # Default background color
            self.label.text_color = neon_green  # Default text color
            self.line_color = neon_green  # Default line color

    def animate_color_pulse(self, widget, color_property, color1, color2, duration=1):
        # Create an animation that pulses between two colors
        animation = Animation(**{color_property: color1}, duration=duration) + Animation(**{color_property: color2}, duration=duration)
        animation.repeat = True  # Make the animation repeat
        animation.start(widget)
    
    def stop_pulsing(self):
        # Stop all pulsing animations
        Animation.cancel_all(self, self.label)
        
    def update_visual_state(self):
        """
        Update the visual state of the chip based on active and failed properties.
        """
        if self.active:
            # If active, start pulsing, regardless of the failed state.
            self.start_pulsing()
        elif self.failed:
            # If not active, but failed, show red without pulsing.
            self.show_failed_state()
        else:
            # If neither active nor failed, revert to default state.
            self.revert_to_default_state()

    def start_pulsing(self):
        """
        Start pulsing between neon green and orange.
        """
        neon_green = [.16, .67, .27, 1]
        orange = [1, 0.5, 0, 1]
        self.animate_color_pulse(self.label, 'text_color', neon_green, orange)
        self.animate_color_pulse(self, 'line_color', neon_green, orange)

    def show_failed_state(self):
        """
        Show the failed state using the custom failed color without pulsing.
        """
        self.stop_pulsing()
        self.line_color = self.failed_color  # Set line color to custom failed color
        self.label.text_color = self.failed_color  # Set text color to custom failed color
    def revert_to_default_state(self):
        """
        Revert to the default visual state.
        """
        self.stop_pulsing()
        self.md_bg_color = [0, 0, 0, 1]  # Default background color
        self.line_color = [.16, .67, .27, 1]  # Default line color
        self.label.text_color = [.16, .67, .27, 1]  # Default text color

    # ... [rest of your existing methods] ...

    def on_active(self, instance, active_value):
        self.update_visual_state()

    def on_failed(self, instance, failed_value):
        self.update_visual_state()

class StatusBar(BoxLayout):
    bg_color = ListProperty([0, 0, 0, 1])  # Default to black background

    def __init__(self, **kwargs):
        super(StatusBar, self).__init__(**kwargs)
        self.orientation = 'horizontal'  # Arrange children from left to right
        self.size_hint_y = None
        self.height = 30  # Set the height of the status bar
        self.bind(height=self.update_children_height)
        self.spacing = 8 # Space between children
        with self.canvas.before:
            Color(rgba=self.bg_color)  # Use the background color
            self.rect = Rectangle(size=self.size, pos=self.pos)

        # Update the rectangle size and position when the widget size changes
        self.bind(size=self.update_rect, pos=self.update_rect, bg_color=self.update_color)

    def update_rect(self, *args):
        self.rect.size = self.size
        self.rect.pos = self.pos

    def update_color(self, *args):
        self.rect.color = self.bg_color

    def update_children_height(self, *args):
        # Assuming padding is a list [left, top, right, bottom]
        top_padding = self.padding[1]
        bottom_padding = self.padding[3]
        left_padding = self.padding[0]
        right_padding = self.padding[2]
        for child in self.children:
            # Subtract the top and bottom padding from the height
            child.height = (self.height) - (top_padding + bottom_padding)
            child.width = (self.width) - (left_padding + right_padding)
            


    def on_size(self, *args):
        # Ensure the width of the status bar always matches the window width
        self.width = Window.width
        
class BottomBar(BoxLayout):
    bg_color = ListProperty([0, 0, 0, 1])  # Default to black background

    def __init__(self, **kwargs):
        super(BottomBar, self).__init__(**kwargs)
        self.orientation = 'horizontal'  # Arrange children from left to right
        self.size_hint_y = None
        self.bind(height=self.update_children_height)
        self.pos_hint: {"bottom": .99}  # This positions it at the top of the FloatLayout
        self.spacing = 8 # Space between children
        with self.canvas.before:
            Color(rgba=self.bg_color)  # Use the background color
            self.rect = Rectangle(size=self.size, pos=self.pos)

        # Update the rectangle size and position when the widget size changes
        self.bind(size=self.update_rect, pos=self.update_rect)

    def update_rect(self, *args):
        self.rect.size = self.size
        self.rect.pos = self.pos

    def on_size(self, *args):
        # Ensure the width of the status bar always matches the window width
        self.width = Window.width
        
    def update_children_height(self, *args):
        # Assuming padding is a list [left, top, right, bottom]
        top_padding = self.padding[1]
        bottom_padding = self.padding[3]
        left_padding = self.padding[0]
        right_padding = self.padding[2]
        for child in self.children:
            # Subtract the top and bottom padding from the height
            child.height = (self.height) - (top_padding + bottom_padding)
            child.width = (self.width) - (left_padding + right_padding)
            
class CustomDropdown(BoxLayout):
    menu_items = ListProperty()
    default_text = StringProperty("Select an item")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.menu = None

    def on_menu_items(self, instance, value):
        # Create the dropdown menu when menu items are set
        self.menu = MDDropdownMenu(
            caller=self.ids.drop_item,
            items=self.menu_items,
            width_mult=4,
            position="center",
        )

    def show_menu(self):
        # Bind the on_release method of each menu item to the set_item method
        for item in self.menu.items:
            item["on_release"] = lambda x=item["text"]: self.set_item(x)
        self.menu.open()

    def set_item(self, text_item):
        # Set the text of the drop-down item and close the menu
        self.ids.drop_item.set_item(text_item)
        self.menu.dismiss()


class Segment(Widget):
    color = ListProperty([0.1, 0.5, 0.7, 1])  # Default color of a segment

class VerticalSegmentedProgressBar(BoxLayout):
    value = NumericProperty(0)  # The current value of the progress bar
    segments = NumericProperty(16)  # Total number of segments
    filled_color = ListProperty([0, 1, 0, 1])  # Default filled segment color (green)
    empty_color = ListProperty([0.14, 0.14, 0.14, 1])  # Default empty segment color (grey)
    label = StringProperty("")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.update_segments()
        # Add label to the bottom of the progress bar
        self.bind(filled_color=self.on_filled_color)
        
    def on_kv_post(self, base_widget):
        self.add_widget(Label(text=self.label, halign='center', valign='middle', font_size=dp(12)))
        return super().on_kv_post(base_widget)

    def on_filled_color(self, instance, value):
        self.filled_color = value
        self.update_segments()  # Update the segments when filled_color changes

    def on_label(self, instance, value):
        self.label = value
        self.update_segments()

    def update_segments(self):
        self.clear_widgets()  # Remove existing segments
        filled = int(self.segments * self.value / 99)  # Calculate how many segments should be filled

        # Create the segments from bottom to top
        for i in range(self.segments):
            if self.segments - i <= filled:
                self.add_widget(Segment(color=self.filled_color))  # Use filled_color
            else:
                self.add_widget(Segment(color=self.empty_color))  # Use empty_color
                
class HorizontalSegmentedProgressBar(BoxLayout):
    value = NumericProperty(0)  # Current RPM value
    segments = NumericProperty(60)  # Total number of segments
    rpm_ranges = ListProperty([(0, 4500), (4501, 6250), (6251, 7000)])  # RPM ranges
    rpm_colors = ListProperty([(0, 1, 0, 1), (1, 0.5, 0, 1), (1, 0, 0, 1)])  # Corresponding colors
    dimmed_colors = ListProperty([(0, 0.5, 0, 0.5), (0.5, 0.25, 0, 0.5), (0.5, 0, 0, 0.5)])  # Dimmed colors for inactive segments
    empty_color = ListProperty([0.14, 0.14, 0.14, 1])  # Empty segment color
    label = StringProperty("")
    flash_color = ListProperty([0.14, 0.14, 0.14, 1])  # Color for flashing effect
    flash_duration = NumericProperty(0.06)  # Duration of each flash in seconds
    is_flashing = BooleanProperty(False)  # Flashing state
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = 'horizontal'  # Set layout to horizontal
        self.update_segments()
        
    def on_value(self, instance, value):
            if not self.is_flashing:
                self.update_segments()
            if value >= 6350 and not self.is_flashing:  # Check if RPM reaches the shift point
                self.start_flashing()
            elif value < 6350 and self.is_flashing:
                self.stop_flashing()
                
    def start_flashing(self):
        self.is_flashing = True
        Clock.schedule_interval(self.flash, self.flash_duration)

    def stop_flashing(self):
        self.is_flashing = False
        Clock.unschedule(self.flash)
        self.update_segments()  # Update segments to show normal state

    def flash(self, dt):
        if self.is_flashing:
            for segment in self.children:
                segment.color = self.flash_color if segment.color != self.flash_color else self.get_color_for_value(self.value)
        else:
            self.stop_flashing()
            
    def update_segments(self):
        self.clear_widgets()
        max_rpm = self.rpm_ranges[-1][1]  # Max RPM value, assuming the last range ends with the highest RPM
        segment_rpm = max_rpm / self.segments  # RPM value each segment represents

        for i in range(self.segments):
            segment_value = segment_rpm * i
            if segment_value < self.value:
                segment_color = self.get_color_for_value(segment_value)
            else:
                segment_color = self.get_dimmed_color_for_value(segment_value)
            
            self.add_widget(Segment(color=segment_color))

    def get_color_for_value(self, value):
        for i, (start, end) in enumerate(self.rpm_ranges):
            if start <= value <= end:
                return self.rpm_colors[i]
        return self.empty_color

    def get_dimmed_color_for_value(self, value):
        for i, (start, end) in enumerate(self.rpm_ranges):
            if start <= value <= end:
                return self.dimmed_colors[i]
        return self.empty_color

class CustomSlider(MDSlider):
    # ids = ObjectProperty()
    sending = False
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.pos = 10, 10
        self.min = -1
        self.max = 12
        self.show_off = False
        
        # Trendy color updates:
        self.hint_text_color = "white"
        self.hint_bg_color = "#FF9A8B"  # Pastel red
        self.track_color_inactive = "grey"  # Light blue
        self.color = "#90D5EC"  # Soft cyan
        self.thumb_color_active = "#FAD0C4"  # Peach
        self.thumb_color_inactive = "#FAD0C4"  # Peach

    def on_touch_up(self, touch):
        # print(self.ids)

        is_touched = False
        if not self.sending:
            self.sending = True
            for item in touch.grab_list:
                # Check if the item is a weakref instance
                if isinstance(item, weakref.ref):
                    # Dereference and check if it's CustomSlider
                    if isinstance(item(), CustomSlider):
                        is_touched = True
            if is_touched:
                bm3 = BM3()
                # Change value to the nearest single precision .5
                if self.value < 0:
                    self.value = -1
                    
                print(self.value)
                Clock.schedule_once(lambda dt: bm3.send_live_adjust_burble(self.value))
                
                
        Clock.schedule_once(self.reset_sending, 0.5)
        return super().on_touch_up(touch)
    
    def reset_sending(self, *args):
        self.sending = False

class StatusChipButton(MDFlatButton):
    chip_text = StringProperty("Map")
    menu_items = ListProperty([{"text": f"Map {i}"} for i in range(4)])
    theme_text_color = "Custom"
    text_color = ListProperty([1, 1, 1, 1])
    def __init__(self, **kwargs):
        super(StatusChipButton, self).__init__(**kwargs)
        self.text = self.chip_text
        self.font_size = '18sp'  # Increased font size
        self.pos_hint = {"center_x": 0.5, "center_y": 0.5}
        self.md_bg_color = [0, 0, 0, 1]  # Customize as needed
        # Set up the dropdown menu
        self.menu = MDDropdownMenu(
            caller=self,
            items=self.menu_items,
            width_mult=4,
        )
        self.md_bg_color = [0.0, 0.5, 1.0, 1]
        # self.add_widget(self.label)
        self.pos_hint = {"x": 0.01, "center_y": 0.5}
        
        # self.md_bg_color = [0,0, 0, 1]  # Fully transparent background
        # self.line_color = [0.0, 0.75, 1.0, 1]  # Green line color
        # self.width = dp(42)  # Starting width, adjust as needed
        # self.line_width = 1
        # self.check = False  # Set to False if you don't want the check icon
        self.padding = [dp(12), dp(12), dp(12), dp(12)]  # Horizontal padding
        self.menu.bind(on_release=self.menu_callback)
        self.on_release = self.open_menu

    def on_chip_text(self, instance, value):
        self.text = value

    def open_menu(self):
        self.menu.open()

    def menu_callback(self, instance_menu, instance_menu_item):
        # Define actions here when a menu item is selected
        pass

    # Include your animation methods and other necessary methods from StatusChip


class MainApp(MDApp):
    theme_cls = ThemeManager()
    theme_cls.theme_style = "Dark"
    theme_cls.primary_palette = "Red"
    
    AcceleratorPosition = NumericProperty(0)
    # BrakePedalPosition = NumericProperty(0)
    ThrottleAngle = NumericProperty(0)
    
    def build(self):
        # self.bm3 = BM3()
        # BM3ConnectionThread = threading.Thread(name='bm3_connection_thread', target=BM3().connect)
        # BM3ConnectionThread.start()
        pass
        
    def start(self):
        self.root.ids.sm.current = 'gauge1'
        self.root.ids.sm.transition = FadeTransition()
        Clock.schedule_interval(self.update_vars, 1)
        # Clock.schedule_interval(bm3.send_for_vin, 5)
        Clock.schedule_interval(self.update_vehicle_data, .1)
        
    def stop(self):
        Clock.unschedule(self.update_vars)
        Clock.unschedule(self.update_vehicle_data)
        self.kill_bm3_agent()

    TempUnit = StringProperty()
    # SpeedUnit = StringProperty()
    ipAddress = StringProperty()
    ssid = StringProperty()
    WifiNetwork = StringProperty()
    CPUTemp = StringProperty()
    CPUVoltage = StringProperty()
    shutdownFlag = NumericProperty()
    NetworkConnected = BooleanProperty()
    VIN = StringProperty()

    # Vehicle
    CurrentMap = StringProperty("-1")
    CustomRom = BooleanProperty(False)
    BurbleAgg = NumericProperty(0)
    BurbleStatus = BooleanProperty(False)
    
    Boost = NumericProperty(0)
    RPM = NumericProperty(0)
    TEST_RPM = 200
    TEST_BOOST = 1
    CoolantTemp = NumericProperty(0)
    OilTemp = NumericProperty(0)
    IntakeAirTemp = NumericProperty(0)
    BM3EthanolPercent = NumericProperty(0)
    Ign1Timing = NumericProperty(0)
    AFR = NumericProperty(0)
    STFT = NumericProperty(0)
    LTFT = NumericProperty(0)
        
    # Gauge Bar Images
    OilTemp_Image = StringProperty('data/gauges/normal/s2k_0.png')
    Boost_Image = StringProperty('data/gauges/normal/s2k_0.png')
    CoolantTemp_Image = StringProperty('data/gauges/normal/s2k_0.png')
    IntakeTemp_Image = StringProperty('data/gauges/normal/s2k_0.png')
    Ign1Timing_Image = StringProperty('data/gauges/normal/s2k_0.png')
    AFR_Image = StringProperty('data/gauges/normal/s2k_0.png')
    
    BM3Connecting = BooleanProperty(False)
    BM3Connected = BooleanProperty(False)
    BM3AgentPID = NumericProperty(-1)
    
    ReceivingData = BooleanProperty(False)
    isRequestingAdjustment = BooleanProperty(False)
    
    LETS_FUCKING_GO = BooleanProperty(False)
    rpm_zero_time = None

    def update_vars(self, *args):
        self.TempUnit = sys.TempUnit
        self.NetworkConnected = sys.NetworkConnected
        self.ipAddress = sys.ip
        self.ssid = sys.ssid
        if sys.get_system_info == True:
            self.get_IP()
    
    def update_vehicle_data(self, *args):
        bm3 = BM3()
        self.BM3ConnectionConnecting = bm3.Connecting
        self.BM3Connected = bm3.Connected
        self.ReceivingData = bm3.Receiving_Data
        # if DEVELOPER_MODE == 1:
        #     self.RPM += self.TEST_RPM
        #     if self.RPM > 7000:
        #         self.TEST_RPM = -100
        #     if self.RPM < 0:
        #         self.TEST_RPM = 100
        # else:
        #     self.RPM = bm3.get_car_data(Car.Data.RPM)
        # Test boost
        self.Boost += self.TEST_BOOST
        if self.Boost > 23:
            self.TEST_BOOST = -1
        if self.Boost < 1:
            self.TEST_BOOST = 1
        
        
        self.RPM = bm3.get_car_data(Car.Data.RPM)
        self.isRequestingAdjustment = bm3.isRequestingAdjustment
        
        # if self.RPM == 0 and not bm3.isRequestingAdjustment:
        #     # If the timer is not already set, set it
        #     if not self.rpm_zero_time:
        #         self.rpm_zero_time = time.time()
        #     else:
        #         if time.time() - self.rpm_zero_time > 20:
        #             self.kill_bm3_agent()
        #             self.rpm_zero_time = None  # Reset the timer
        #             self.root.ids.sm.current = 'start'
        #             return
        # else:
        #     # If RPM is not zero, reset the timer
        #     self.rpm_zero_time = None
        
        if not bm3.Connected or self.BM3AgentPID == -1 or not bm3.Receiving_Data:
            return
        
        if (bm3.current_map == "-1"):
            self.CurrentMap = bm3.current_map
            Clock.schedule_once(self.update_map, 2)
        else:
            self.CurrentMap = bm3.current_map
        
        if (bm3.custom_rom == False):
            self.CustomRom = bm3.custom_rom
            Clock.schedule_once(self.update_ids, 2)
        else:
            self.CustomRom = bm3.custom_rom
        
        if (bm3.current_burble_agg_value == -1):
            self.BurbleAgg = bm3.current_burble_agg_value
            self.BurbleStatus = bm3.current_burble_status
            Clock.schedule_once(self.update_rburble, 2)
        else: 
            self.BurbleAgg = bm3.current_burble_agg_value
            self.BurbleStatus = bm3.current_burble_status
        
        self.Boost = int(bm3.get_car_data(Car.Data.Boost))
        self.IntakeAirTemp = (bm3.get_car_data(Car.Data.IntakeAirTemp))
        self.BM3EthanolPercent = bm3.get_car_data(Car.Data.BM3EthanolPercent)
        
        self.CoolantTemp = bm3.get_car_data(Car.Data.CoolantTemp)
        self.Ign1Timing = bm3.get_car_data(Car.Data.Ign1Timing)
        self.AFR = (bm3.get_car_data(Car.Data.AFR))
        self.OilTemp = bm3.get_car_data(Car.Data.OilTemp)
        self.STFT = bm3.get_car_data(Car.Data.STFT)
        self.LTFT = bm3.get_car_data(Car.Data.LTFT)
        self.AcceleratorPosition = bm3.get_car_data(Car.Data.AcceleratorPosition)
        self.ThrottleAngle = bm3.get_car_data(Car.Data.ThrottleAngle)
   
        self.VIN = Car.Data.VIN
        
        self.LETS_FUCKING_GO = self.OilTemp > 200 and self.CoolantTemp > 200 and 7 <= self.BM3EthanolPercent <= 50 and self.IntakeAirTemp <= 180

        # if DEVELOPER_MODE == 1:
        # # increase up and down coolant temp
        #     if Car.dev.OilTemp_inc == 1:
        #         Car.dev.OilTemp = Car.dev.OilTemp + 1
        #     else:
        #         Car.dev.OilTemp = Car.dev.OilTemp - 1
        #     if Car.dev.OilTemp > 300:
        #         Car.dev.OilTemp_inc = 0
        #     if Car.dev.OilTemp < 1:
        #         Car.dev.OilTemp_inc = 1
        #     self.OilTemp = Car.dev.OilTemp
            
        if 0 <= int(round(self.Boost/Car.gauge.persegment.Boost)) <= 32:
            self.Boost_Image = str(Car.gauge.image.Boost+(str(int(round(self.Boost/Car.gauge.persegment.Boost))))+'.png')
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
                sys.NetworkConnected = True
                sys.ip = s.getsockname()[0]
            except:
                sys.NetworkConnected = False
                sys.ip = ""
                print("Could not get IP")
            try:
                ssidstr = str(subprocess.check_output("iwgetid -r", shell=True))
                sys.ssid = ssidstr[2:-3]
            except:
                sys.ssid = ""
                print("Could not get SSID")

        self.ipAddress = sys.ip
        self.WifiNetwork = sys.ssid
        
    def start_bm3_agent(self):
        # Change the current working directory to the script's directory
        script_directory = os.path.dirname(os.path.abspath(__file__))
        os.chdir(script_directory)

        # Attempt to run the file
        try:
            # check if script is running on a Raspberry Pi
   
            if 'aarch64' in os.uname().machine:
                process = subprocess.Popen(["./bootmod3_linux-arm"])
            else:
                process = subprocess.Popen(["./bootmod3_linux-amd64"])
            self.BM3AgentPID = process.pid
        except Exception as e:
            print("Error:", e)
        
    def kill_bm3_agent(self):
        if self.BM3AgentPID != -1:
            os.kill(self.BM3AgentPID, signal.SIGTERM)
            self.BM3AgentPID = -1
            
    def update_ids(self, *args):
        bm3 = BM3()
        bm3.send_for_ids()
        Clock.unschedule(self.update_ids)
    
    def update_rburble(self, *args):
        bm3 = BM3()
        bm3.send_for_rburble()
        Clock.unschedule(self.update_rburble)
    
    def update_map(self, *args):
        bm3 = BM3()
        bm3.send_map_switch()
        Clock.unschedule(self.update_map)
    
            
if __name__ =='__main__':
    MainApp().run()
    
    