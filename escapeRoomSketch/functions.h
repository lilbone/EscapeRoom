#include "WString.h"
#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include "params.h"

void IRAM_ATTR handleButtonPress() {
  buttonPressed = true;
}

int findMaxIdx(const int messwerteArr[]) {
  int maxValue = messwerteArr[0];               // Initialisierung des maximalen Werts mit dem ersten Wert im Array
  int idx = 0;                                  // Index des maximalen Werts initialisieren
  for (int i = 1; i < ANZAHL_MESSWERTE; i++) {  // Schleife durch alle Messwerte
    if (messwerteArr[i] > maxValue) {           // Überprüfen, ob der aktuelle Wert größer als der bisherige maximale Wert ist
      maxValue = messwerteArr[i];               // Aktualisierung des maximalen Werts
      idx = i;                                  // Aktualisierung des Index des maximalen Werts
    }
  }
  return idx;  // Rückgabe des Index des maximalen Werts
}

int findMinIdx(const int messwerteArr[]) {
  int minValue = messwerteArr[0];               // Initialisierung des minimalen Werts mit dem ersten Wert im Array
  int idx = 0;                                  // Index des minimalen Werts initialisieren
  for (int i = 1; i < ANZAHL_MESSWERTE; i++) {  // Schleife durch alle Messwerte
    if (messwerteArr[i] < minValue) {           // Überprüfen, ob der aktuelle Wert kleiner als der bisherige minimale Wert ist
      minValue = messwerteArr[i];               // Aktualisierung des minimalen Werts
      idx = i;                                  // Aktualisierung des Index des minimalen Werts
    }
  }
  return idx;  // Rückgabe des Index des minimalen Werts
}

int brightnessAvgCalc(const int messwerteArr[]) {
  int AVG = 0;                                   // Durchschnittsvariable initialisieren
  const int idx_max = findMaxIdx(messwerteArr);  // Index des maximalen Werts finden
  const int idx_min = findMinIdx(messwerteArr);  // Index des minimalen Werts finden

  for (int i = 0; i < ANZAHL_MESSWERTE; i++) {  // Schleife durch alle Messwerte
    if (i != idx_max && i != idx_min)           // Überprüfen, ob der Index nicht dem Index des maximalen oder minimalen Werts entspricht
    {
      AVG += messwerteArr[i];  // Wert zum Durchschnitt hinzufügen
    }
  }
  return AVG / (ANZAHL_MESSWERTE - 2);  // Durchschnitt berechnen und zurückgeben
}

void publishData(String topic, String payload) {
  mqttClient.publish(topic.c_str(), payload.c_str());
  Serial << "PUBLISH: Topic = " << topic << " Payload = " << payload << endl;
}

void checkRFID() {
  if (mfrc522.PICC_IsNewCardPresent()) {
    if (mfrc522.PICC_ReadCardSerial()) {
      Serial << "Card UID: ";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        if (mfrc522.uid.uidByte[i] < 0x10) {
          Serial << " 0";
        } else {
          Serial << " ";
        }
        Serial << _HEX(mfrc522.uid.uidByte[i]);
      }
      Serial << endl;
      // Hier könntest du die UID auch an MQTT senden
      String uidString = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) {
        uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") + String(mfrc522.uid.uidByte[i], HEX);
      }
      publishData("esp/rfid/uid", uidString);
      sendRfid = false;
      mfrc522.PICC_HaltA();  // Stop reading
    } else {
      Serial << "Error reading card." << endl;
    }
  } else {
    Serial << "No card present." << endl;
  }
}

void playMorseCode() {
  unsigned long currentMorseCodeMillis = millis();
  static bool isSymbolSpace = false;
  
  if (playingMorse && currentMorseCodeMillis - previousMillisMorseCode >= waittime) {
    previousMillisMorseCode = currentMorseCodeMillis;
    char symbol = morseBuffer[morseIndex];

    if(prev_sym == '.' || prev_sym == '-'){
      digitalWrite(LED_RED, LOW);
      publishData(TOPIC_LAMP_STATUS, "0");
      waittime = WAIT_TIME;
      prev_sym = ' ';
    }else if (symbol == '.') {
      digitalWrite(LED_RED, HIGH);
      publishData(TOPIC_LAMP_STATUS, "1");
      prev_sym = symbol;
      waittime = DOT_TIME;
      morseIndex++;
    } else if (symbol == '-') {
      digitalWrite(LED_RED, HIGH);
      publishData(TOPIC_LAMP_STATUS, "1");
      waittime = HYPHEN_TIME;
      prev_sym = symbol;
      morseIndex++;
    } else if (symbol == ' ') {
      digitalWrite(LED_RED, LOW);
      publishData(TOPIC_LAMP_STATUS, "0");
      waittime = SPACE_TIME;
      prev_sym = ' ';
      morseIndex++;
    } else {
      digitalWrite(LED_RED, LOW);
      playingMorse = false;
      publishData(TOPIC_LAMP_STATUS, "0");
      morseIndex = 0; // Reset Morse index
    }
    if (morseIndex >= strlen(morseBuffer)) {
      morseIndex = 0; // Wiederholen des Morse-Codes
      isSymbolSpace = false; // Startet mit Buchstabenpause beim Wiederholen
    }
  }
}


void callback(char* c_topic, byte* payload, unsigned int length) {
  // convert ayload to string
  String msg, topic;
  for (byte i = 0; i < length; i++) {
    msg += char(payload[i]);
  }
  topic = String(c_topic);
  Serial << "CALLBACK: Topic = " << topic << " Payload = " << msg << endl;

  // processing topics received
  if (topic == TOPIC_LAMP) {
    if (msg == "1") {
      digitalWrite(LED_RED, HIGH);
      publishData(TOPIC_LAMP_STATUS, "1");
    }
    if (msg == "0") {
      digitalWrite(LED_RED, LOW);
      publishData(TOPIC_LAMP_STATUS, "0");
    }
  }

  if (topic == TOPIC_SEND_HUMIDITY) {
    Serial << "send humidity " << msg << endl;
    if (msg == "1") {
      sendHumidity = true;
      publishData(TOPIC_HUMIDITY, String(humidity));
    }
    if (msg == "0") {
      sendHumidity = false;
    }
  }

  if (topic == TOPIC_SEND_LDR) {
    Serial << "send brightness " << msg << endl;
    if (msg == "1") {
      sendBrightness = true;
      publishData(TOPIC_LDR, String(brightness));
    }
    if (msg == "0") {
      sendBrightness = false;
    }
  }

  if (topic == MORSECODE_NR_TOPIC) {
    if (msg == "1") {
      strncpy(morseBuffer, SOS, sizeof(morseBuffer) - 1);
      playingMorse = true;
    } else if(msg == "2"){
      strncpy(morseBuffer, SEK, sizeof(morseBuffer) - 1);
      playingMorse = true;
    } else if(msg == "3"){
      strncpy(morseBuffer, NSA, sizeof(morseBuffer) - 1);
      playingMorse = true;
    } else {
      playingMorse = false;
      morseIndex = 0;
      digitalWrite(LED_RED, LOW);
      publishData(TOPIC_LAMP_STATUS, "0");
    }
  }

  if (topic = RFID_SEND_TOPIC) {
    if (msg == "2") {
      sendRfid = true;
    }else
      sendRfid = false;
  }
}

boolean mqttAvailable() {
  while (!mqttClient.connected()) {
    Serial << "connecting to MQTT-Broker: ";
    Serial << MQTT_BROKER << endl;
    mqttClient.connect("ESP-Client_xyz");
    mqttClient.subscribe(TOPIC_LAMP);
    mqttClient.subscribe(TOPIC_SEND_HUMIDITY);
    mqttClient.subscribe(MORSECODE_NR_TOPIC);
    mqttClient.subscribe(RFID_SEND_TOPIC);
  }
  return mqttClient.connected();
}

#endif
