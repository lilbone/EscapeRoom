#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>

const char* ssid = "MrRobot";      // WIFI SSID for station mode
const char* psk = "Pa55wortBohn";  // WIFI PSK

const char* ap_ssid = "EscapeRoomWifi";  // WIFI SSID for AP mode
const char* ap_psk = "EscapeRoomWifi";   // WIFI PSK


//#define AP_MODE                     // comment for station mode

//ESP8266WebServer server(80);  // server port