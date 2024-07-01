/* ################################################################
 Filename      : mqtt.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Globale Variablen
var client = null; // MQTT-Client
var led_is_on = false; // Status der LED, benötigt für led_toggle()

// Konfigurationen
const HOSTNAME = "192.168.4.1";
const PORT = "80";
const PATH = "/ws";
const CLIENTID = "mqtt_js_" + parseInt(Math.random() * 100000, 10);

const LDR_TOPIC = "esp/brightness"; // Thema für den Helligkeitssensor
const TOPIC_SEND_LDR = "esp/brightness/send";

const HUMIDITY_TOPIC = "esp/humidity"; // Thema für die Luftfeuchtigkeit

const TEMPERATURE_TOPIC = "esp/temperature"; // Thema für die Temperatur

const RFID_SEND_TOPIC = "esp/rfid/send"; // Thema zum Senden des RFID
const RFID_UID_TOPIC = "esp/rfid/uid"; // Thema zum Empfangen der RFID-UID

const TOPIC_LAMP = "esp/lighting/led_yellow"; // Thema für die rote LED
const LAMP_STATUS_TOPIC = "esp/lighting/led_yellow_status"; // Thema für den Status der roten LED

const BUTTON3_TOPIC = "esp/btn3"; // Thema für den dritten Button

const MORSECODE_NR_TOPIC = "morsecode/nr"; // Thema für den Morsecode

let humidity = 0; // Variable zur Speicherung der aktuellen Luftfeuchtigkeit
let beginHumidity = 0; // Variable zur Speicherung der ersten gemessenen Luftfeuchtigkeit

window.onload = connect(); // Wenn die Webseite vollständig geladen ist, wird connect() aufgerufen

// Hauptfunktion zum Herstellen der Verbindung zum MQTT-Broker
function connect() {
  // Client einrichten
  client = new Paho.MQTT.Client(HOSTNAME, Number(PORT), PATH, CLIENTID);
  console.info(
    "Verbindung zum Server wird hergestellt: Hostname: ",
    HOSTNAME,
    ". Port: ",
    PORT,
    ". Client ID: ",
    CLIENTID
  );

  // Callback-Handler setzen
  client.onConnectionLost = onConnectionLost; // Bei Verbindungsverlust
  client.onMessageArrived = onMessageArrived; // Bei eintreffenden Nachrichten

  // Optionen für die Verbindung setzen
  var options = {
    onSuccess: onConnect, // Nach erfolgreicher Verbindung wird onConnect aufgerufen
    onFailure: onFail, // Bei Fehlschlagen der Verbindung
  };

  // Client mit den oben festgelegten Optionen verbinden
  client.connect(options);
  console.info("Verbindung wird hergestellt...");
}

// Funktion, die bei erfolgreicher Verbindung zum MQTT-Broker aufgerufen wird
function onConnect(context) {
  console.log("Client verbunden");

  // Optionen für das Abonnieren von Themen
  options = {
    qos: 0,
    onSuccess: function (context) {
      console.log("> SUB-ACK");
    },
  };
  // Relevante Themen abonnieren
  client.subscribe(LAMP_STATUS_TOPIC, options);
  client.subscribe(HUMIDITY_TOPIC, options);
  
  // Nachricht mit Wert 0 senden
  message = new Paho.MQTT.Message("0");
  message.destinationName = RFID_SEND_TOPIC;
  message.retained = true;
  console.log("< PUB", message.destinationName, "0");
  client.send(message);
  message = new Paho.MQTT.Message("0");
  message.destinationName = MORSECODE_NR_TOPIC;
  message.retained = true;
  console.log("< PUB", message.destinationName, "0");
  client.send(message);
}

// Funktion, die aufgerufen wird, wenn die Verbindung zum MQTT-Broker fehlschlägt
function onFail(context) {
  console.log("Verbindung fehlgeschlagen");
}

// Funktion, die aufgerufen wird, wenn die Verbindung zum MQTT-Broker verloren geht
function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Verbindung verloren: " + responseObject.errorMessage);
    window.alert("Verbindung verloren: " + responseObject.errorMessage);
  }
}

// Funktion, die aufgerufen wird, wenn eine MQTT-Nachricht eintrifft
function onMessageArrived(message) {
  console.log("> PUB", message.destinationName, message.payloadString);

  // Aktualisieren der Elemente der Webseite basierend auf dem Thema der Nachricht
  if (message.destinationName == LDR_TOPIC) {
    if (message.payloadString >= 450) {
      showRfidChip(true);
    } else {
      showRfidChip(false);
    }
  } else if (message.destinationName == LAMP_STATUS_TOPIC) {
    // Status der LED basierend auf der Nachricht aktualisieren
    if (message.payloadString == "1") {
      //morseCodeSound.play();
      led_is_on = true;
    } else {
      //morseCodeSound.pause();
      morseCodeSound.currentTime = 0;
      led_is_on = false;
    }
  } else if (message.destinationName == HUMIDITY_TOPIC) {
    // Erste Veröffentlichung der Luftfeuchtigkeit speichern
    if (!mirror1Visible) {
      beginHumidity = message.payloadString;
    }else{
      humidity = message.payloadString;
    }
  } else if (message.destinationName == BUTTON3_TOPIC) {
    if (message.payloadString == "1") {
      toggleLightRoom3(); // Licht im Raum 3 umschalten
    }
  } else if (message.destinationName == RFID_UID_TOPIC) {
    // Aktion ausführen, wenn die richtige RFID-UID empfangen wird
    if (message.payloadString == "30f0987e") {
      win = true;
      lightAmpSound.play();
      document.getElementById("alarmLamp").style.backgroundImage = "url('../images/room3/revolving-light-green.png')";
    }
  }
}

// Funktion zum Abonnieren eines Themas
function subscribe_topic(topic) {
  options = {
    qos: 0,
    onSuccess: function (context) {
      console.log("> SUB-Ack " + topic);
    },
  };
  console.log("> SUB " + topic);
  client.subscribe(topic, options);
}
