// Liste der Objekte im Raum 2
const room2Objects = [
  { id: "morse-code-device", top: 405, left: 205, width: 26, height: 47 },
];

// Passwort für Tür 2
const passwordDoor2 = "trowssap";

// Mögliche Morsecode-Nachrichten
const morseCodeMessage = ["sos", "sek", "nsa"];

// Zufällige Auswahl einer Morsecode-Nachricht
const randomMorseCodeNumber = Math.floor(Math.random() * 3) + 1;

// Morsecode-Sound
const morseCodeSound = new Audio('../sounds/morsesound.mp3'); 
morseCodeSound.volume = 0.1;

// Funktion zur Überprüfung der Bewegung an der oberen Wand des Raums 2
function checkMoveRoom2TopWall(playerPositionBefore, playerPosition) {
  // Raum 2 Obere Wand
  if (
    playerPosition.left < 244 &&
    playerPositionBefore.top <= 306 &&
    playerPosition.top > 306
  ) {
    if (
      !(
        playerPosition.left >= 85 &&
        playerPosition.left <= 115 &&
        canMoveThroughDoor(2)
      )
    ) {
      playerPosition.top = 306;
      actualRoom = 0;
    } else {
      playerPosition.top = 348;
      actualRoom = 2;
    }
  }

  if (
    playerPosition.left < 244 &&
    playerPositionBefore.top >= 348 &&
    playerPosition.top < 348
  ) {
    if (
      !(
        playerPosition.left >= 85 &&
        playerPosition.left <= 115 &&
        canMoveThroughDoor(2)
      )
    ) {
      playerPosition.top = 348;
      actualRoom = 2;
    } else {
      playerPosition.top = 306;
      actualRoom = 0;
    }
  }
}

// Funktion zur Überprüfung der Bewegung an der rechten Wand des Raums 2
function checkMoveRoom2RightWall(playerPositionBefore, playerPosition) {
  // Raum 2 Rechte Wand
  if (
    playerPositionBefore.left >= 244 &&
    playerPosition.left < 244 &&
    playerPosition.top > 306
  ) {
    playerPosition.left = 244;
  }
  if (
    playerPositionBefore.left <= 201 &&
    playerPosition.left > 201 &&
    playerPosition.top > 306
  ) {
    playerPosition.left = 201;
  }
}

// Funktion zur Überprüfung der Position der Tür im Raum 2
function checkRoom2DoorPos(playerPosition) {
  const playerElement = document.getElementById("player");
  if ( playerPosition.left > 75 && playerPosition.left < 125 && playerPosition.top > 270 && playerPosition.top <= 306 && !canMoveThroughDoor(2)) {
    playerElement.classList.add("show-after"); // Füge eine Klasse hinzu, um das zusätzliche Bild anzuzeigen

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showDoor2PwDialog);
  } else if (actualRoom == 0) {
    playerElement.classList.remove("show-after"); // Entferne die Klasse, um das zusätzliche Bild auszublenden

    // Entferne den Event-Listener
    document.removeEventListener("keydown", showDoor2PwDialog);
    document.querySelector(".jumbotron").style.display = "none";
    jumbotronVisible = false; // Aktualisiere den Zustand auf unsichtbar
  }
}

// Funktion zur Anzeige des Passwortdialogs für Tür 2
function showDoor2PwDialog(event) {
  if (event.key === "Enter") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      jumbotronElem.style.display = "none";
      jumbotronVisible = false;
    } else {
      jumbotronElem.innerHTML = `   <h2>Passwort</h2>
                                    <input type="password" name="door2pw" id="door2pw" />`;

      document.getElementById("door2pw").addEventListener("change", (e) => {
        let inputValue = e.target.value;
        if (inputValue == passwordDoor2) {
          // Zugreifen auf das Tür-Element
          const door = document.querySelector(".door-2");
          // Zugrifff auf die Raumhelligkeit
          const lightRoom2 = document.getElementById("lightRoom2");
          // Ändern des data-state-Attributs auf "open"
          doorSound.play();
          door.setAttribute("data-state", "open");

          lightRoom2.style.backgroundColor = "#00000000";
        }
      });

      jumbotronElem.style.display = "flex";
      jumbotronVisible = true;
    }
  }
}

// Variable zur Überprüfung, ob der Morsecode bereits gesendet wurde
let messageSent = false;

// Funktion zur Überprüfung der Position des Morsecode-Geräts im Raum 2
function checkRoom2MorseCodePos(playerPosition, playerPositionBefore) {
  const playerElement = document.querySelector("#player");
  if (playerPosition.left > 140 && playerPosition.left <= 175 && playerPosition.top > 395 && playerPosition.top < 428) {
    playerElement.classList.add("show-after"); // Füge eine Klasse hinzu, um das zusätzliche Bild anzuzeigen

    // Überprüfe, ob die Nachricht noch nicht gesendet wurde
    if (!messageSent) {
      // Senden der Nachricht
      message = new Paho.MQTT.Message("" + randomMorseCodeNumber);
      message.destinationName = MORSECODE_NR_TOPIC;
      message.retained = true;
      console.log("< PUB", message.destinationName, "" + randomMorseCodeNumber);
      client.send(message);

      // Markiere, dass die Nachricht gesendet wurde
      messageSent = true;
    }

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showRoom2MorseCodeDialog);
  } else if (actualRoom == 2 && playerPositionBefore.left > 140 && playerPositionBefore.left <= 175 && playerPositionBefore.top > 395 && playerPositionBefore.top < 428 && (playerPosition.left < 140 || playerPosition.top < 395 || playerPosition.top > 428)) {
    playerElement.classList.remove("show-after"); // Entferne die Klasse, um das zusätzliche Bild auszublenden

    // Sende Nachricht mit Wert 0
    message = new Paho.MQTT.Message("0");
    message.destinationName = MORSECODE_NR_TOPIC;
    message.retained = true;
    console.log("< PUB", message.destinationName, "0");
    client.send(message);

    // Setze messageSent zurück auf false
    messageSent = false;

    // Entferne den Event-Listener
    document.removeEventListener("keydown", showRoom2MorseCodeDialog);
  }
}

// Funktion zur Anzeige des Dialogs für den Morsecode im Raum 2
function showRoom2MorseCodeDialog(event) {
  if (event.key === "Enter") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      jumbotronElem.style.display = "none";
      jumbotronVisible = false;
      console.log("Jumbotron is now hidden");
    } else {
      jumbotronElem.innerHTML = `   <h2>Nachricht?</h2>
                                     <input type="text" name="morseCodeMessage" id="morseCodeMessage" />`;

      document
        .getElementById("morseCodeMessage")
        .addEventListener("change", (e) => {
          let inputValue = e.target.value;
          if (inputValue == morseCodeMessage[randomMorseCodeNumber-1]) {
            // Zeige die Hexagone an
            document.getElementById("hexagon1").style.display = "block";
            document.getElementById("hexagon2").style.display = "block";
            document.getElementById("hexagon3").style.display = "block";
            hexagonVisible = true;
          }
          
        });

      jumbotronElem.style.display = "flex";
      jumbotronVisible = true;
    }
  }
}

