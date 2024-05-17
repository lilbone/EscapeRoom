#ifndef PARAMS_H
#define PARAMS_H

// WiFi-Parameter
const char* SSID = "MrRobot";      // WIFI SSID,
const char* PSK = "Pa55wortBohn";  // WIFI PSK

// MQTT-Parameter
const char* MQTT_BROKER = "192.168.43.133";
const uint16_t PORT = 1883;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// MQTT-Themen
#define TOPIC_LAMP "esp/lighting/led_red"
#define TOPIC_LAMP_STATUS "esp/lighting/led_red_status"
#define TOPIC_LDR "esp/brightness"
#define TOPIC_HUMIDITY "esp/humidity"
#define TOPIC_SEND_HUMIDITY "esp/humidity/send"
#define MORSECODE_NR_TOPIC "morsecode/nr"
#define TOPIC_TEMPERATURE "esp/temperature"

// Variablen für RFID
#define RST_PIN D1  // RST-PIN für RC522
#define SS_PIN D2   // SDA-PIN für RC522
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Erstellen einer MFRC522-Instanz
/*
Orange 3,3v   -> 3,3v
Gelb RST      -> 5
Schwarz SDA   -> 4
Grün GND      -> GND
Weiß SCK      -> 14
Lila MISO     -> 12
Grau MOSI     -> 13 
 */

//Variablen für DHT22
#define DHT_TYPE DHT22  // Typ des DHT-Sensors
#define DHT_PIN D5      // Pin, an dem der DHT-Sensor angeschlossen ist
#define DHT_POWER D0    // Pin zur Stromversorgung des DHT-Sensors

#define LED_RED 15

// Variablen für LDR
const int SENSOR = 0;             // Analog-Pin, an dem der LDR (Light Dependent Resistor) angeschlossen ist
const int ANZAHL_MESSWERTE = 25;  // Anzahl der Messwerte zur Durchschnittsbildung
const int HYSTERESE = 10;         // Hysterese für den LDR-Wert
bool leaveHyst = true;            // Variable zur Überwachung der Hysterese

// Globale Variablen
boolean sendHumidity = false;
int brightness = 0;
int humidity = 0;

unsigned long previousMillis = 0;
unsigned long previousMqttMillis = 0;
const long interval = 200;
unsigned long previousMillisMorseCode = 0;

// MorseCode Variablen
#define DOT_TIME 50 
#define HYPHEN_TIME 1000
#define SPACE_TIME 500 
#define WAIT_TIME 50
#define SOS "  ... --- ... "
#define SEK "  ... . -.- "
#define NSA "  -. ... .- "
int morseIndex = 0;
bool isLetterSpace = false;
volatile bool playingMorse = false;
int waittime = 0;
char prev_sym = ' ';
char morseBuffer[50];

#endif
