let mirror1Visible = false;
let intervalIdHumidity;

const room1Objects = [
  { id: "computer", top: 5, left: 10, width: 78, height: 62 },
  { id: "mirror", top: 0, left: 160, width: 55, height: 6 },
];

function checkRoom1MirrorPos(playerPosition, playerPositionBefore) {
  const playerElement = document.querySelector("#player");
  if (
    playerPosition.left > 160 &&
    playerPosition.left < 180 &&
    playerPosition.top > 6 &&
    playerPosition.top <= 35
  ) {
    playerElement.classList.add("show-after"); // Füge eine Klasse hinzu, um das zusätzliche Bild anzuzeigen

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showMirror1);
  } else if (
    actualRoom == 1 &&
    playerPositionBefore.left > 160 &&
    playerPositionBefore.left < 180 &&
    playerPositionBefore.top > 6 &&
    playerPositionBefore.top <= 35
  ) {
    playerElement.classList.remove("show-after"); // Entferne die Klasse, um das zusätzliche Bild auszublenden

    // Entferne den Event-Listener
    document.removeEventListener("keydown", showMirror1);
    document.querySelector("#mirror").style.display = "none";
    document.querySelector("#mirror").classList.remove("animateMirror"); // Entferne die Animationsklasse
    document.querySelector("#mirror p").classList.remove("animate-mirror-p"); // Entferne die Animationsklasse für den Text
    document
      .querySelector("#player-background")
      .classList.remove("animate-layer-background"); // Entferne die

    // Send messgae
    message = new Paho.MQTT.Message("0");
    message.destinationName = HUMIDITY_SEND_TOPIC;
    message.retained = true;
    console.log("< PUB", message.destinationName, "0");
    client.send(message);

    clearInterval(intervalIdHumidity);

    mirror1Visible = false; // Aktualisiere den Zustand auf unsichtbar
  }
}

function showMirror1(event) {
  // Überprüfe, ob die gedrückte Taste die "Enter"-Taste ist
  if (event.key === "Enter") {
    // Wenn das Jumbotron sichtbar ist, setze das Display auf "none"
    if (mirror1Visible) {
      document.querySelector("#mirror").style.display = "none";
      document.querySelector("#mirror").classList.remove("animateMirror"); // Entferne die Animationsklasse
      document.querySelector("#mirror p").classList.remove("animate-mirror-p"); // Entferne die Animationsklasse für den Text
      document
        .querySelector("#player-background")
        .classList.remove("animate-layer-background"); // Entferne die Animationsklasse für den Hintergrund

      // Send messgae
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

      // Send messgae
      message = new Paho.MQTT.Message("1");
      message.destinationName = HUMIDITY_SEND_TOPIC;
      message.retained = true;
      console.log("< PUB", message.destinationName, "1");
      client.send(message);

      checkHumidityAndAnimate();

      mirror1Visible = true;
    }
  }
}

function checkHumidityAndAnimate() {
  // Abonniere das Thema, um die Feuchtigkeitsdaten zu erhalten
  subscribe_topic(HUMIDITY_TOPIC);

  // Setze ein Intervall, das alle 100ms überprüft
  intervalIdHumidity = setInterval(() => {
    if (humidity > 50) {
      // Stoppe das Intervall, wenn die Bedingung erfüllt ist
      clearInterval(intervalIdHumidity);

      // Führe die Animationsbefehle aus
      document.querySelector("#mirror").classList.add("animateMirror");
      document.querySelector("#mirror p").classList.add("animate-mirror-p");
      document
        .querySelector("#player-background")
        .classList.add("animate-layer-background");
    }
  }, 300);
}

function checkMoveRoom1RightWall(playerPositionBefore, playerPosition) {
  // Raum 1 Rechte Wand
  if (
    playerPositionBefore.left >= 244 &&
    playerPosition.left < 244 &&
    playerPosition.top < 244
  ) {
    if (
      !(
        playerPosition.top >= 85 &&
        playerPosition.top <= 115 &&
        canMoveThroughDoor(1)
      )
    ) {
      playerPosition.left = 244;
      actualRoom = 0;
    } else {
      playerPosition.left = 201;
      actualRoom = 1;
    }
  } else {
    if (
      playerPositionBefore.left <= 201 &&
      playerPosition.left > 201 &&
      playerPosition.top < 244
    ) {
      if (
        !(
          playerPosition.top >= 85 &&
          playerPosition.top <= 115 &&
          canMoveThroughDoor(1)
        )
      ) {
        playerPosition.left = 201;
        actualRoom = 1;
      } else {
        playerPosition.left = 244;
        actualRoom = 0;
      }
    }
  }
}

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
