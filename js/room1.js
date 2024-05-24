// Variable zur Überprüfung, ob der Spiegel im Raum 1 sichtbar ist
let mirror1Visible = false;

// ID des Intervalls für die Feuchtigkeitsüberprüfung
let intervalIdHumidity;

// Objekte im Raum 1 mit ihren Positionen und Abmessungen
const room1Objects = [
  { id: "pc-table", top: 5, left: 10, width: 78, height: 25 },
  { id: "mirror", top: 0, left: 160, width: 55, height: 6 },
  { id: "pc-chair", top: 35, left: 35, width: 26, height: 29 },
];

// Funktion zur Überprüfung der Position des Spiegels im Raum 1
function checkRoom1MirrorPos(playerPosition, playerPositionBefore) {
  const playerElement = document.querySelector("#player");
  if (actualRoom == 1 && playerPosition.left >= 160 && playerPosition.left <= 180 && playerPosition.top >= 6 && playerPosition.top <= 35) {
    playerElement.classList.add("show-after"); // Füge eine Klasse hinzu, um das zusätzliche Bild anzuzeigen

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showMirror1);
  } else if (actualRoom == 1 && playerPositionBefore.left >= 160 && playerPositionBefore.left <= 180 && playerPositionBefore.top >= 6 && playerPositionBefore.top <= 35 && (playerPosition.left < 160 || playerPosition.left > 180 || playerPosition.top < 6 || playerPosition.top > 35)) {
    playerElement.classList.remove("show-after"); // Entferne die Klasse, um das zusätzliche Bild auszublenden

    // Entferne den Event-Listener
    document.removeEventListener("keydown", showMirror1);
    document.querySelector("#mirror").style.display = "none";
    document.querySelector("#mirror").classList.remove("animateMirror"); // Entferne die Animationsklasse
    document.querySelector("#mirror p").classList.remove("animate-mirror-p"); // Entferne die Animationsklasse für den Text
    document
      .querySelector("#player-background")
      .classList.remove("animate-layer-background"); // Entferne die Animationsklasse für den Hintergrund

    // Abonnement vom Thema HUMIDITY_TOPIC kündigen
    client.unsubscribe(HUMIDITY_TOPIC, {
      onSuccess: function () {
        console.log("Abonnement von " + HUMIDITY_TOPIC + " gekündigt");
      }
    });

    // Sende Nachricht mit Wert 0
    message = new Paho.MQTT.Message("0");
    message.destinationName = HUMIDITY_SEND_TOPIC;
    message.retained = true;
    console.log("< PUB", message.destinationName, "0");
    client.send(message);

    clearInterval(intervalIdHumidity);

    mirror1Visible = false; // Aktualisiere den Zustand auf unsichtbar
  }
}
// Funktion zur Anzeige des Spiegels im Raum 1
function showMirror1(event) {
  // Überprüfe, ob die gedrückte Taste die "Enter"-Taste ist
  if (event.code === "Space") {
    // Wenn das Jumbotron sichtbar ist, setze das Display auf "none"
    if (mirror1Visible) {
      document.querySelector("#mirror").style.display = "none";
      document.querySelector("#mirror").classList.remove("animateMirror"); // Entferne die Animationsklasse
      document.querySelector("#mirror p").classList.remove("animate-mirror-p"); // Entferne die Animationsklasse für den Text
      document
        .querySelector("#player-background")
        .classList.remove("animate-layer-background"); // Entferne die Animationsklasse für den Hintergrund

      // Abonnement vom Thema HUMIDITY_TOPIC kündigen
      client.unsubscribe(HUMIDITY_TOPIC, {
        onSuccess: function () {
          console.log("Abonnement von " + HUMIDITY_TOPIC + " gekündigt");
        }
      });

      // Sende Nachricht mit Wert 0
      message = new Paho.MQTT.Message("0");
      message.destinationName = HUMIDITY_SEND_TOPIC;
      message.retained = true;
      console.log("< PUB", message.destinationName, "0");
      client.send(message);

      clearInterval(intervalIdHumidity);

      mirror1Visible = false; // Aktualisiere den Zustand auf unsichtbar
    } else {
      // Andernfalls setze das Display auf "flex", füge die Animationsklassen hinzu und aktualisiere den Zustand auf sichtbar
      document.querySelector("#mirror").style.display = "block";

      firstHumidityPub = true;

      // Sende Nachricht mit Wert 1
      message = new Paho.MQTT.Message("1");
      message.destinationName = HUMIDITY_SEND_TOPIC;
      message.retained = true;
      console.log("< PUB", message.destinationName, "1");
      client.send(message);

      // Überprüfe die Feuchtigkeit und führe die Animation aus
      checkHumidityAndAnimate();

      mirror1Visible = true;
    }
  }
}
// Funktion zur überprüfung der Feuchtigkeitsdaten
function checkHumidityAndAnimate() {
  // Abonniere das Thema, um die Feuchtigkeitsdaten zu erhalten
  subscribe_topic(HUMIDITY_TOPIC);

  // Setze ein Intervall, das alle 100ms überprüft
  intervalIdHumidity = setInterval(() => {
    if (humidity > firstHumidity + 5) {
      // Stoppe das Intervall, wenn die Bedingung erfüllt ist
      clearInterval(intervalIdHumidity);

      // Führe die Animationsbefehle aus
      document.querySelector("#mirror").classList.add("animateMirror");
      document.querySelector("#mirror p").classList.add("animate-mirror-p");
      document
        .querySelector("#player-background")
        .classList.add("animate-layer-background");
    }
  }, 200);
}

function checkRoom1PcPos(playerPosition, playerPositionBefore) {
  if (playerPosition.left >= 0 && playerPosition.left <= 88 && playerPosition.top >= 30 && playerPosition.top <= 60) {

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    if (!mirrorPuzzle) {
      document.addEventListener("keydown", showMirrorPuzzleInfo);
    }else if (mirrorPuzzle && morseCodePuzzle && !lightSwitch3Puzzle) {
      document.addEventListener("keydown", showLightSwitch3PuzzleInfo);
    }
  } else if (actualRoom == 1 && playerPositionBefore.left >= 0 && playerPositionBefore.left <= 88 && playerPositionBefore.top >= 30 && playerPositionBefore.top <= 60 && (playerPosition.left < 0 || playerPosition.left > 88 || playerPosition.top < 30 || playerPosition.top > 60)) {
    // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
    jumbotronElem.style.display = "none";
    jumbotronElem.style.background = "steelblue";
    jumbotronElem.style.borderRadius = "8px";
    jumbotronElem.style.boxShadow = "snow 0px 0px 26px 5px";
    jumbotronElem.style.alignItems = "center";
    jumbotronElem.style.border = "none";

    jumbotronVisible = false;

    // Entferne den Event-Listener für das Tastaturereignis "keydown" hinzu
    if (!mirrorPuzzle) {
      document.removeEventListener("keydown", showMirrorPuzzleInfo);
    }else if (mirrorPuzzle && morseCodePuzzle && !lightSwitch3Puzzle) {
      document.removeEventListener("keydown", showLightSwitch3PuzzleInfo);
    }
  }
}
function showMirrorPuzzleInfo(event){
  if (event.code === "Space") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
      jumbotronElem.style.display = "none";
      jumbotronElem.style.background = "steelblue";
      jumbotronElem.style.borderRadius = "8px";
      jumbotronElem.style.boxShadow = "snow 0px 0px 26px 5px";
      jumbotronElem.style.alignItems = "center";
      jumbotronElem.style.border = "none";

      jumbotronVisible = false;
    } else {

      const today = new Date().toLocaleDateString();
      const mail = `
        <p><b>NEUE E-MAIL</b></p>
        <p><b>Von:</b> ESCAPE ROOM SYSTEM</p>
        <p><b>An:</b> SPIELER</p>
        <p><b>Datum:</b> ${today}</p>
        <br>
        <p><b>Nachricht:</b></p>
        <p>Was unsichtbar ist, wird sichtbar, wenn der Atem der Natur es berührt.</p>
      `;
      jumbotronElem.innerHTML = mail;

      jumbotronElem.style.display = "flex";
      jumbotronElem.style.background = "#e6e5e5";
      jumbotronElem.style.borderRadius = "0"; // kein border-radius
      jumbotronElem.style.border = "2px solid";
      jumbotronElem.style.boxShadow = "snow 0px 0px 8px 0px";
      jumbotronElem.style.alignItems = "flex-start"; // oder eine andere geeignete Einstellung

      jumbotronVisible = true;
    }
  }
}
function showLightSwitch3PuzzleInfo(event){
  if (event.code === "Space") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
      jumbotronElem.style.display = "none";
      jumbotronElem.style.background = "steelblue";
      jumbotronElem.style.borderRadius = "8px";
      jumbotronElem.style.boxShadow = "snow 0px 0px 26px 5px";
      jumbotronElem.style.alignItems = "center";
      jumbotronElem.style.border = "none";

      jumbotronVisible = false;
    } else {

      const today = new Date().toLocaleDateString();
      const mail = `
        <p><b>NEUE E-MAIL</b></p>
        <p><b>Von:</b> ESCAPE ROOM SYSTEM</p>
        <p><b>An:</b> SPIELER</p>
        <p><b>Datum:</b> ${today}</p>
        <br>
        <p><b>Nachricht:</b></p>
        <p>Finde den dritten von drei, um den Pfad zu erleuchten.</p>
      `;
      jumbotronElem.innerHTML = mail;

      jumbotronElem.style.display = "flex";
      jumbotronElem.style.background = "#e6e5e5";
      jumbotronElem.style.borderRadius = "0"; // kein border-radius
      jumbotronElem.style.border = "2px solid";
      jumbotronElem.style.boxShadow = "snow 0px 0px 8px 0px";
      jumbotronElem.style.alignItems = "flex-start"; // oder eine andere geeignete Einstellung

      jumbotronVisible = true;
    }
  }
}

// Funktion zur Überprüfung der Bewegung an der rechten Wand im Raum 1
function checkMoveRoom1RightWall(playerPositionBefore, playerPosition) {
  // Raum 1 Rechte Wand
  if (playerPositionBefore.left >= 244 && playerPosition.left < 244 && playerPosition.top < 244) {
    if (!(playerPosition.top >= 85 && playerPosition.top <= 115 && canMoveThroughDoor(1))) {
      playerPosition.left = 244;
      actualRoom = 0;
    } else {
      playerPosition.left = 201;
      actualRoom = 1;
    }
  } else {
    if (playerPositionBefore.left <= 201 && playerPosition.left > 201 && playerPosition.top < 244) {
      if (!(playerPosition.top >= 85 && playerPosition.top <= 115 && canMoveThroughDoor(1))) {
        playerPosition.left = 201;
        actualRoom = 1;
      } else {
        playerPosition.left = 244;
        actualRoom = 0;
      }
    }
  }
}

// Funktion zur Überprüfung der Bewegung an der unteren Wand im Raum 1
function checkMoveRoom1BottomWall(playerPositionBefore, playerPosition) {
  // Raum 1 Untere Wand
  if (
    playerPosition.left < 244 &&
    playerPositionBefore.top <= 202 &&
    playerPosition.top > 202
  ) {
    playerPosition.top = 202;
  }
  if (
    playerPosition.left < 244 &&
    playerPositionBefore.top >= 244 &&
    playerPosition.top < 244
  ) {
    playerPosition.top = 244;
  }
}
