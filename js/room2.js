/* ################################################################
 Filename      : room2.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Liste der Objekte im Raum 2
const room2Objects = [
  { id: "morse-code-device", top: 405, left: 205, width: 26, height: 47 },
  { id: "pc-table2", top: 554, left: 105, width: 78, height: 30 },
];
// Passwort für Tür 2
const passwordDoor2 = "trowssap";

// Mögliche Morsecode-Nachrichten
const morseCodeMessage = ["sos", "sek", "nsa"];

// Zufällige Auswahl einer Morsecode-Nachricht
const randomMorseCodeNumber = Math.floor(Math.random() * 3) + 1;

// Morsecode-Sound
const morseCodeSound = new Audio('../sounds/morsesound.mp3');
morseCodeSound.volume = 0.2;

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
function checkRoom2DoorPos(playerPosition, playerPositionBefore) {
  const playerElement = document.getElementById("player");
  if (playerPosition.left >= 70 && playerPosition.left <= 130 && playerPosition.top >= 290 && playerPosition.top <= 306 && !canMoveThroughDoor(2)) {
    playerElement.classList.add("show-after"); // Füge eine Klasse hinzu, um das zusätzliche Bild anzuzeigen

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showDoor2PwDialog);
  } else if (playerPositionBefore.left >= 70 && playerPositionBefore.left <= 130 && playerPositionBefore.top >= 290 && playerPositionBefore.top <= 306 && (playerPosition.left < 70 || playerPosition.left > 130 || playerPosition.top < 290 || playerPosition.top > 306)) {
    playerElement.classList.remove("show-after"); // Entferne die Klasse, um das zusätzliche Bild auszublenden

    // Entferne den Event-Listener
    document.removeEventListener("keydown", showDoor2PwDialog);
    document.querySelector(".jumbotron").style.display = "none";
    jumbotronVisible = false; // Aktualisiere den Zustand auf unsichtbar
  }
}

// Funktion zur Anzeige des Passwortdialogs für Tür 2
function showDoor2PwDialog(event) {
  if (event.code === "Space") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      jumbotronElem.style.display = "none";
      jumbotronVisible = false;
    } else {
      jumbotronElem.innerHTML = `
        <h2>Passwort</h2>
        <input type="password" name="door2pw" id="door2pw" />
      `;

      // Ensuring the focus is set after the element is rendered and visible
      setTimeout(() => {
        const inputElem = document.getElementById("door2pw");
        // Set focus to the input field
        inputElem.focus();

        inputElem.addEventListener("change", (e) => {
          let inputValue = e.target.value.toLowerCase();

          if (inputValue == passwordDoor2) {

            mirrorPuzzle = true;
            mirrorPuzzleFirstHelp = false;
            puzzleSeconds = 0;

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
      }, 0);

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
  if (actualRoom == 2 && playerPosition.left > 160 && playerPosition.left <= 170 && playerPosition.top > 395 && playerPosition.top < 428) {
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
  } else if (actualRoom == 2 && playerPositionBefore.left >= 160 && playerPositionBefore.left <= 170 && playerPositionBefore.top >= 395 && playerPositionBefore.top <= 428 && (playerPosition.left < 160 || playerPosition.left > 170 || playerPosition.top < 395 || playerPosition.top > 428)) {
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
    document.querySelector(".jumbotron").style.display = "none";
    document.removeEventListener("keydown", showRoom2MorseCodeDialog);
  }
}

// Funktion zur Anzeige des Dialogs für den Morsecode im Raum 2
function showRoom2MorseCodeDialog(event) {
  if (event.code === "Space") {
    let jumbotronElem = document.querySelector(".jumbotron");

    if (jumbotronVisible) {
      jumbotronElem.style.display = "none";
      jumbotronVisible = false;
    } else {
      jumbotronElem.innerHTML = `
        <h2>Nachricht?</h2>
        <input type="text" name="morseCodeMessage" id="morseCodeMessage" />
      `;

      jumbotronElem.style.display = "flex";
      jumbotronVisible = true;

      // Ensuring the focus is set after the element is rendered and visible
      setTimeout(() => {
        const inputElem = document.getElementById("morseCodeMessage");
        inputElem.focus();

        inputElem.addEventListener("change", (e) => {
          let inputValue = e.target.value.toLowerCase();
          if (inputValue == morseCodeMessage[randomMorseCodeNumber - 1]) {

            morseCodePuzzle = true;
            morseCodePuzzleFirstHelp = false;
            puzzleSeconds = 0;

            hexagonOffSound.play();
            document.getElementById("hexagon1").style.display = "block";
            document.getElementById("hexagon2").style.display = "block";
            document.getElementById("hexagon3").style.display = "block";
            hexagonVisible = true;
          }
        });
      }, 0);
    }
  }
}

function checkRoom2TablePos(playerPosition, playerPositionBefore) {
  if (actualRoom == 2 && playerPosition.left >= 130 && playerPosition.left <= 160 && playerPosition.top >= 504 && playerPosition.top <= 519) {

    // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.addEventListener("keydown", showMorseCodePuzzleInfo);

  } else if (actualRoom == 2 && playerPositionBefore.left >= 130 && playerPositionBefore.left <= 160 && playerPositionBefore.top >= 504 && playerPositionBefore.top <= 519 && (playerPosition.left < 130 || playerPosition.left > 160 || playerPosition.top < 504 || playerPosition.top > 519)) {
    // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
    jumbotronElem.style.display = "none";
    jumbotronElem.style.background = "steelblue";
    jumbotronElem.style.borderRadius = "8px";
    jumbotronElem.style.boxShadow = "snow 0px 0px 26px 5px";
    jumbotronElem.style.alignItems = "center";
    jumbotronElem.style.border = "none";

    jumbotronVisible = false;

    // Entferne den Event-Listener für das Tastaturereignis "keydown" hinzu
    document.removeEventListener("keydown", showMorseCodePuzzleInfo);

  }
}
function showMorseCodePuzzleInfo(event) {
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
      const faxMessage = `
        <p><b>FAX-NACHRICHT</b></p>
        <p><b>Von:</b> ESCAPE ROOM SYSTEM</p>
        <p><b>An:</b> SPIELER</p>
        <p><b>Datum:</b> ${today}</p>
        <br>
        <p><b>Nachricht:</b></p>
        <p>Blinkende Lichter tanzen im Rhythmus der Punkte und Striche.</p>
        <p>Die Antwort liegt in den alten Mustern.</p>
        <p>Erkenne 3 Zeichen, um den Weg zu finden.</p>
      `;
      jumbotronElem.innerHTML = faxMessage;

      jumbotronElem.style.display = "flex";
      jumbotronElem.style.background = "#e6e5e5";
      jumbotronElem.style.borderRadius = "0";
      jumbotronElem.style.border = "2px solid";
      jumbotronElem.style.boxShadow = "snow 0px 0px 8px 0px";
      jumbotronElem.style.alignItems = "flex-start";

      jumbotronVisible = true;
    }
  }
}
