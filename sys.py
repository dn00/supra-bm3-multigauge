from main import GLOBAL_VERSION, DEVELOPER_MODE
import os
import socket
import subprocess

class sys:
    version = GLOBAL_VERSION
    ip = "No IP address found..."
    ssid = "No SSID found..."
    CPUTemp = 0
    CPUVolts = 0
    getsysteminfo = False
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
