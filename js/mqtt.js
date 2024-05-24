// Globale Variablen
var client = null;
var led_is_on = null; // wird für led_toggle() benötigt
let firstHumidityPub = true;

// Konfigurationen
const HOSTNAME = "192.168.43.133";
const PORT = "80";
const PATH = "/ws";
const CLIENTID = "mqtt_js_" + parseInt(Math.random() * 100000, 10);

const LDR_TOPIC = "esp/brightness"; // Thema für den Helligkeitssensor
const TOPIC_SEND_LDR = "esp/brightness/send";

const HUMIDITY_TOPIC = "esp/humidity"; // Thema für die Luftfeuchtigkeit
const HUMIDITY_SEND_TOPIC = "esp/humidity/send"; // Thema zum Senden der Luftfeuchtigkeit

const TEMPERATURE_TOPIC = "esp/temperature"; // Thema für die Temperatur

const RFID_SEND_TOPIC = "esp/rfid/send"; // Thema zum Senden RFID
const RFID_UID_TOPIC = "esp/rfid/uid"; // Thema zum Senden RFID

const TOPIC_LAMP = "esp/lighting/led_red"; // Thema für die rote LED
const LAMP_STATUS_TOPIC = "esp/lighting/led_red_status"; // Thema für den Status der roten LED

const BUTTON3_TOPIC = "esp/btn3";

const MORSECODE_NR_TOPIC = "morsecode/nr"; // Thema für den Morsecode

let humidity = 0; // Variable zur Speicherung der Luftfeuchtigkeit
let firstHumidity = 0; // Variable zur Speicherung der Luftfeuchtigkeit

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
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // Optionen für die Verbindung setzen
  var options = {
    onSuccess: onConnect, // nach erfolgreicher Verbindung wird onConnect aufgerufen
    onFailure: onFail, // nützlich für Protokollierung / Debugging
  };

  // Client mit den oben festgelegten Optionen verbinden
  client.connect(options);
  console.info("Verbindung wird hergestellt...");
}

// Funktion, die bei erfolgreicher Verbindung zum MQTT-Broker aufgerufen wird
function onConnect(context) {
  console.log("Client verbunden");
  // Auf die relevanten Themen abonnieren
  options = {
    qos: 0,
    onSuccess: function (context) {
      console.log("> SUB-ACK");
    },
  };
  //client.subscribe(LDR_TOPIC, options);
  //client.subscribe(HUMIDITY_TOPIC, options);
  client.subscribe(LAMP_STATUS_TOPIC, options);
  
  // Sende Nachricht mit Wert 0
  message = new Paho.MQTT.Message("0");
  message.destinationName = RFID_SEND_TOPIC;
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

  // Elemente der Webseite aktualisieren, je nachdem, von welchem Thema die Nachricht stammt
  if (message.destinationName == LDR_TOPIC) {
    if (message.payloadString >= 200) {
      showRfidChip(true);
    }else{
      showRfidChip(false);
    }

  } else if (message.destinationName == LAMP_STATUS_TOPIC) {
    // Payload auswerten
    if (message.payloadString == "1") {
      morseCodeSound.play();
      led_is_on = true;
    } else {
      morseCodeSound.pause();
      morseCodeSound.currentTime = 0;
      led_is_on = false;
    }
  } else if (message.destinationName == HUMIDITY_TOPIC) {

    if (firstHumidityPub){
      firstHumidity = message.payloadString;
      firstHumidityPub = false;
    }
    humidity = message.payloadString;

  } else if (message.destinationName == BUTTON3_TOPIC) {
    if (message.payloadString == "1") {
      toggleLightRoom3();
    }
  } else if (message.destinationName == RFID_UID_TOPIC) {
    
    if (message.payloadString == "30f0987e") {
      win = true;
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

// Funktion zum Umschalten der LED
function led_toggle() {
  var payload;
  if (led_is_on) {
    payload = "0";
    led_is_on = false;
  } else {
    payload = "1";
    led_is_on = true;
  }

  // Nachricht senden
  message = new Paho.MQTT.Message(payload);
  message.destinationName = TOPIC_LAMP;
  message.retained = true;
  console.log("< PUB", message.destinationName, payload);
  client.send(message);
}
