/* ################################################################
 Filename      : escapeRoomSketch.ino
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
#include <DHT.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include <MFRC522.h>
#include "Streaming.h"
#include "wifi.h"
#include "params.h"
#include "functions.h"

DHT dht(DHT_PIN, DHT_TYPE);  // Initialisierung des DHT-Sensors

void setup() {
  Serial.begin(9600);
  Serial << endl
         << "Start Escape-Room" << endl;

  Serial << F("Version: 0.0.5") << endl
         << F("Build: ") << F(__TIME__) << F("  ") << F(__DATE__) << endl
         << F(__FILE__) << endl;

  pinMode(LED_RED, OUTPUT);
  pinMode(TASTER_3, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(TASTER_3), handleButtonPress, FALLING);

  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, psk);
  // wait for AP association
  Serial << "Waiting for association..." << endl;

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial << ".";
  }

  Serial << endl
         << "Associated with " << ssid << endl
         << endl
         << "IP address: " << WiFi.localIP() << endl
         << endl;

  //DHT Sensor
  pinMode(DHT_POWER, OUTPUT);     // Konfiguriere den DHT-Stromversorgungspin als Ausgang
  digitalWrite(DHT_POWER, HIGH);  // Schalte die Stromversorgung für den DHT-Sensor ein
  dht.begin();                    // Initialisierung des DHT-Sensors

  mqttClient.setServer(MQTT_BROKER, PORT);
  //mqttClient.setCallback(callback);

  mqttAvailable();
  mqttClient.setCallback(callback);

  Serial << "setup finished" << endl;
}


void loop() {
  int messwerteArr[ANZAHL_MESSWERTE];
  int brightnessAvg = 0;
  unsigned long currentMillis = millis();  // Aktuelle Zeit abrufen

  if (buttonPressed) {
    buttonPressed = false;
    publishData(TOPIC_BUTTON3, "1");
  }

  // Wird kontinuierlich aufgerufen und prüft den Morse-Code-Status
  if (playingMorse) {
    playMorseCode();
  }

  if (currentMillis - previousMqttMillis >= 200) {
    previousMqttMillis = currentMillis;
    if (mqttAvailable()) {

      unsigned long start = millis();
      do {
        mqttClient.loop();  // processing IN-stack
      } while (millis() - start < 500);

      if (currentMillis - previousMillis >= interval) {
        for (int i = 0; i < ANZAHL_MESSWERTE; i++) {  // Messwerte erfassen
          messwerteArr[i] = analogRead(SENSOR);
        }

        brightnessAvg = brightnessAvgCalc(messwerteArr);  // Durchschnittshelligkeit berechnen

        float h = dht.readHumidity();     // Luftfeuchtigkeit lesen
        float t = dht.readTemperature();  // Temperatur in Celsius lesen

        if (sendBrightness) {
          if (abs(brightnessAvg - brightness) > 50) {
            brightness = brightnessAvg;
            publishData(TOPIC_LDR, String(brightness));
          }
        }

        if (sendHumidity) {
          Serial << h << ", " << humidity << endl;
          if (abs(round(h) - humidity) > 2) {
            humidity = round(h);
            publishData(TOPIC_HUMIDITY, String(humidity));
          }
        }
      }

      if (sendRfid) {
        SPI.begin();         // Init SPI bus
        mfrc522.PCD_Init();  // Init MFRC522

        checkRFID();
      }
    }
  }
}
