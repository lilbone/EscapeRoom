// Global variables
var client = null;
var led_is_on = null; // needed for led_toggle()
// These are configs
const HOSTNAME = "192.168.43.133";
const PORT = "80";
const PATH = "/ws";
const CLIENTID = "mqtt_js_" + parseInt(Math.random() * 100000, 10);

const LDR_TOPIC = "esp/brightness";

const HUMIDITY_TOPIC = "esp/humidity";
const HUMIDITY_SEND_TOPIC = "esp/humidity/send";

const TEMPERATURE_TOPIC = "esp/temperature";

const TOPIC_LAMP = "esp/lighting/led_red";
const LAMP_STATUS_TOPIC = "esp/lighting/led_red_status";

const MORSECODE_NR_TOPIC = "morsecode/nr";

let humidity = 0;


window.onload = connect();

// This is called after the webpage is completely loaded
// It is the main entry point into the JS code
function connect() {
  // Set up the client
  client = new Paho.MQTT.Client(HOSTNAME, Number(PORT), PATH, CLIENTID);
  console.info(
    "Connecting to Server: Hostname: ",
    HOSTNAME,
    ". Port: ",
    PORT,
    ". Client ID: ",
    CLIENTID
  );

  // set callback handlers
  client.onConnectionLost = onConnectionLost;
  client.onMessageArrived = onMessageArrived;

  // see client class docs for all the options
  var options = {
    onSuccess: onConnect, // after connected, subscribes
    onFailure: onFail, // useful for logging / debugging
  };
  // connect the client
  client.connect(options);
  console.info("Connecting...");
}

function onConnect(context) {
  console.log("Client Connected");
  // And subscribe to our topics -- both with the same callback function
  options = {
    qos: 0,
    onSuccess: function (context) {
      console.log("> SUB-ACK");
    },
  };
  console.log("> SUB LDR_TOPIC, LAMP_STATUS_TOPIC");
  client.subscribe(LDR_TOPIC, options);
  client.subscribe(HUMIDITY_TOPIC, options);
  client.subscribe(LAMP_STATUS_TOPIC, options);
}

function onFail(context) {
  console.log("Failed to connect");
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection Lost: " + responseObject.errorMessage);
    window.alert("Connection Lost: " + responseObject.errorMessage);
  }
}

// Here are the two main actions that drive the webpage:
//  handling incoming messages and the toggle button.

// Updates the webpage elements with new data, and
//  tracks the display LED status as well,
//  in case multiple clients are toggling it.
function onMessageArrived(message) {
  console.log("> PUB", message.destinationName, message.payloadString);

  // Update element depending on which topic's data came in
  if (message.destinationName == LDR_TOPIC) {
    console.log("Brightness: " + message.payloadString);
  } else if (message.destinationName == LAMP_STATUS_TOPIC) {
    // Evaluate payload
    if (message.payloadString == "1") {
      morseCodeSound.play();
      led_is_on = true;
      console.log("Led is on");
    } else {
      morseCodeSound.pause();
      morseCodeSound.currentTime = 0;
      led_is_on = false;
      console.log("Led is off");
    }
  }else if (message.destinationName == HUMIDITY_TOPIC) {
    humidity = message.payloadString;
    console.log("Humidity: " + humidity);
  }
}

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

// Provides the button logic that toggles our display LED on and off
// Triggered by pressing the HTML button "led_button"
function led_toggle() {
  if (led_is_on) {
    var payload = "0";
    led_is_on = false;
  } else {
    var payload = "1";
    led_is_on = true;
  }

  // Send messgae
  message = new Paho.MQTT.Message(payload);
  message.destinationName = TOPIC_LAMP;
  message.retained = true;
  console.log("< PUB", message.destinationName, payload);
  client.send(message);
  //console.info('sending: ', payload);
}
