/* ################################################################
 Filename      : functions.h
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
#include "WString.h"
#ifndef FUNCTIONS_H
#define FUNCTIONS_H

#include "params.h"

// Interrupt Service Routine (ISR) für das Drücken des Buttons
void IRAM_ATTR handleButtonPress() {
  buttonPressed = true;
}

// Funktion zum Finden des Index des maximalen Werts im Array
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

// Funktion zum Finden des Index des minimalen Werts im Array
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

// Funktion zur Berechnung des Durchschnitts der Helligkeitswerte
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

// Funktion zum Veröffentlichen von Daten über MQTT
void publishData(String topic, String payload) {
  mqttClient.publish(topic.c_str(), payload.c_str());
  Serial << "PUBLISH: Topic = " << topic << " Payload = " << payload << endl;
}

// Funktion zur Überprüfung des RFID-Tags
void checkRFID() {
  if (mfrc522.PICC_IsNewCardPresent()) {  // Überprüfen, ob eine neue Karte vorhanden ist
    if (mfrc522.PICC_ReadCardSerial()) {  // Überprüfen, ob die Kartendaten gelesen werden können
      Serial << "Card UID: ";
      for (byte i = 0; i < mfrc522.uid.size; i++) {  // Schleife durch die UID-Bytes
        if (mfrc522.uid.uidByte[i] < 0x10) {
          Serial << " 0";
        } else {
          Serial << " ";
        }
        Serial << _HEX(mfrc522.uid.uidByte[i]);  // Ausgabe der UID-Bytes in Hexadezimalformat
      }
      Serial << endl;
      // Hier könntest du die UID auch an MQTT senden
      String uidString = "";
      for (byte i = 0; i < mfrc522.uid.size; i++) {  // Erstellen des UID-Strings
        uidString += String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : "") + String(mfrc522.uid.uidByte[i], HEX);
      }
      publishData("esp/rfid/uid", uidString);  // UID über MQTT senden
      sendRfid = false;
      mfrc522.PICC_HaltA();  // Stop reading
    } else {
      Serial << "Error reading card." << endl;
    }
  } else {
    Serial << "No card present." << endl;
  }
}

// Funktion zum Abspielen des Morse-Codes
void playMorseCode() {
  unsigned long currentMorseCodeMillis = millis();
  static bool isSymbolSpace = false;
  
  if (playingMorse && currentMorseCodeMillis - previousMillisMorseCode >= waittime) {
    previousMillisMorseCode = currentMorseCodeMillis;
    char symbol = morseBuffer[morseIndex];

    if(prev_sym == '.' || prev_sym == '-'){
      digitalWrite(LED_YELLOW, LOW);  // LED ausschalten nach einem Symbol
      publishData(TOPIC_LAMP_STATUS, "0");
      waittime = WAIT_TIME;
      prev_sym = ' ';
    } else if (symbol == '.') {
      digitalWrite(LED_YELLOW, HIGH);  // LED für Punkt-Symbol einschalten
      publishData(TOPIC_LAMP_STATUS, "1");
      prev_sym = symbol;
      waittime = DOT_TIME;
      morseIndex++;
    } else if (symbol == '-') {
      digitalWrite(LED_YELLOW, HIGH);  // LED für Strich-Symbol einschalten
      publishData(TOPIC_LAMP_STATUS, "1");
      waittime = HYPHEN_TIME;
      prev_sym = symbol;
      morseIndex++;
    } else if (symbol == ' ') {
      digitalWrite(LED_YELLOW, LOW);  // LED ausschalten für Leerzeichen
      publishData(TOPIC_LAMP_STATUS, "0");
      waittime = SPACE_TIME;
      prev_sym = ' ';
      morseIndex++;
    } else {
      digitalWrite(LED_YELLOW, LOW);  // LED ausschalten bei unbekanntem Symbol
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

// Callback-Funktion für eingehende MQTT-Nachrichten
void callback(char* c_topic, byte* payload, unsigned int length) {
  // Konvertiere Payload in String
  String msg, topic;
  for (byte i = 0; i < length; i++) {
    msg += char(payload[i]);
  }
  topic = String(c_topic);
  Serial << "CALLBACK: Topic = " << topic << " Payload = " << msg << endl;

  // Verarbeite empfangene Topics
  if (topic == TOPIC_LAMP) {
    if (msg == "1") {
      digitalWrite(LED_YELLOW, HIGH);
      publishData(TOPIC_LAMP_STATUS, "1");
    }
    if (msg == "0") {
      digitalWrite(LED_YELLOW, LOW);
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
      digitalWrite(LED_YELLOW, LOW);
      publishData(TOPIC_LAMP_STATUS, "0");
    }
  }

  if (topic == RFID_SEND_TOPIC) {
    if (msg == "2") {
      sendRfid = true;
    } else {
      sendRfid = false;
    }
  }
}

// Funktion zur Überprüfung der MQTT-Verfügbarkeit und Verbindung
boolean mqttAvailable() {
  while (!mqttClient.connected()) {  // Überprüfen, ob der MQTT-Client verbunden ist
    Serial << "connecting to MQTT-Broker: ";
    Serial << MQTT_BROKER << endl;
    mqttClient.connect("ESP-Client_xyz");  // Verbindung zum MQTT-Broker herstellen
    mqttClient.subscribe(TOPIC_LAMP);  // Abonnieren der benötigten Topics
    mqttClient.subscribe(TOPIC_SEND_HUMIDITY);
    mqttClient.subscribe(TOPIC_SEND_LDR);
    mqttClient.subscribe(MORSECODE_NR_TOPIC);
    mqttClient.subscribe(RFID_SEND_TOPIC);
  }
  return mqttClient.connected();  // Rückgabe des Verbindungsstatus
}

#endif
