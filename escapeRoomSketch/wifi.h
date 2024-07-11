/* ################################################################
 Filename      : wifi.h
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
#include <ESP8266WiFi.h>

//const char* ssid = "EscapeRoomWifi";      // WIFI SSID for station mode
//const char* psk = "EscapeRoomWifi";  // WIFI PSK

const char* ssid = "MrRobot";      // WIFI SSID for station mode
const char* psk = "Pa55wortBohn";  // WIFI PSK

//const char* ssid = "FRITZ!Box 7530 UJ";      // WIFI SSID for station mode
//const char* psk = "83182028375009194505";  // WIFI PSK

const char* ap_ssid = "EscapeRoomWifi";  // WIFI SSID for AP mode
const char* ap_psk = "EscapeRoomWifi";   // WIFI PSK

//#define AP_MODE                     // comment for station mode