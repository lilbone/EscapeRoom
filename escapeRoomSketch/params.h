/* ################################################################
 Filename      : params.h
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
#ifndef PARAMS_H
#define PARAMS_H

// MQTT-Parameter
//const char* MQTT_BROKER = "192.168.4.1";
//const char* MQTT_BROKER = "192.168.43.133";
const char* MQTT_BROKER = "192.168.43.215";
const uint16_t PORT = 1883;

WiFiClient espClient;
PubSubClient mqttClient(espClient);

// MQTT-Themen
#define TOPIC_LAMP "esp/lighting/led_yellow"
#define TOPIC_LAMP_STATUS "esp/lighting/led_yellow_status"
#define TOPIC_LDR "esp/brightness"
#define TOPIC_SEND_LDR "esp/brightness/send"
#define TOPIC_HUMIDITY "esp/humidity"
#define TOPIC_SEND_HUMIDITY "esp/humidity/send"
#define MORSECODE_NR_TOPIC "morsecode/nr"
#define TOPIC_TEMPERATURE "esp/temperature"
#define TOPIC_BUTTON3 "esp/btn3"
#define RFID_SEND_TOPIC "esp/rfid/send"

// Variablen für RFID
#define RST_PIN D2  // RST-PIN für RC522
#define SS_PIN D1   // SDA-PIN für RC522
volatile bool sendRfid = false;
MFRC522 mfrc522(SS_PIN, RST_PIN);  // Erstellen einer MFRC522-Instanz
/*
Orange 3,3v   -> 3,3v
Gelb RST      -> 3 RXD
Schwarz SDA   -> 5
Grün GND      -> GND
Weiß SCK      -> 14
Lila MISO     -> 12
Grau MOSI     -> 13 
 */

#define TASTER_3 2
volatile bool buttonPressed = false;

//Variablen für DHT22
#define DHT_TYPE DHT22  // Typ des DHT-Sensors
#define DHT_PIN 14      // Pin, an dem der DHT-Sensor angeschlossen ist
#define DHT_POWER 4    // Pin zur Stromversorgung des DHT-Sensors
float h;

#define LED_YELLOW 13
#define LED_GREEN 12

// Variablen für LDR
const int SENSOR = 0;             // Analog-Pin, an dem der LDR (Light Dependent Resistor) angeschlossen ist
const int ANZAHL_MESSWERTE = 25;  // Anzahl der Messwerte zur Durchschnittsbildung
const int HYSTERESE = 10;         // Hysterese für den LDR-Wert
bool leaveHyst = true;            // Variable zur Überwachung der Hysterese
volatile bool sendBrightness = false;

// Globale Variablen
int brightness = 0;
int humidity = 0;

unsigned long previousMillis = 0;
unsigned long previousMqttMillis = 0;
const long interval = 200;
unsigned long previousMillisMorseCode = 0;

// MorseCode Variablen
#define DOT_TIME 250 
#define HYPHEN_TIME 1100
#define SPACE_TIME 650 
#define WAIT_TIME 200
#define SOS "* ...  ---  ...    "
#define SEK "* ...  .  -.-    "
#define NSA "* -.  ...  .-    "
int morseIndex = 0;
bool isLetterSpace = false;
volatile bool playingMorse = false;
int waittime = 0;
char prev_sym = ' ';
char morseBuffer[50];

#endif
