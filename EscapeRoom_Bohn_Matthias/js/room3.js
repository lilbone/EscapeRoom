/* ################################################################
 Filename      : room3.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Liste der Objekte im Raum 3
const room3Objects = [
   { id: "table-dining", top: 380, left: 440, width: 86, height: 150 },
   { id: "schrank", top: 0, left: 435, width: 99, height: 28 },
   { id: "reader", top: 160, left: 348, width: 30, height: 34 },
];

let rfidCount = 0;
let lightRoom3State = false;

// Funktion zur Überprüfung der Bewegung an der linken Wand des Raums 3
function checkMoveRoom3LeftWall(playerPositionBefore, playerPosition) {
   // Überprüfung der linken Wand im Raum 3
   if (playerPositionBefore.left <= 305 && playerPosition.left > 305) {
      if (!(playerPosition.top >= 260 && playerPosition.top <= 290 && canMoveThroughDoor(3))) {
         playerPosition.left = 305;
         actualRoom = 0;
      } else {
         playerPosition.left = 348;
         actualRoom = 3;
      }
   }

   // Überprüfung der linken Wand im Raum 3 (umgekehrte Richtung)
   if (playerPositionBefore.left >= 348 && playerPosition.left < 348) {
      if (!(playerPosition.top >= 260 && playerPosition.top <= 290 && canMoveThroughDoor(3))) {
         playerPosition.left = 348;
         actualRoom = 3;
      } else {
         playerPosition.left = 305;
         actualRoom = 0;
      }
   }
}

// Funktion zur Überprüfung der Position des Lichtschalters im Raum 3
function checkRoom3LightSwitchPos(playerPosition, playerPositionBefore) {
   const playerElement = document.querySelector("#player");
   // Überprüfung, ob der Spieler sich in der Nähe des Lichtschalters befindet und ob er sich im Raum 3 befindet
   if (playerPosition.left > 300 && playerPosition.left <= 305 && playerPosition.top >= 320 && playerPosition.top <= 340 && actualRoom == 0) {
      playerElement.classList.add("show-after"); // Klasse hinzufügen, um zusätzliches Bild anzuzeigen

      // Event-Listener für das Tastaturereignis "keydown" hinzufügen, um die Taste zu lesen
      readButton(true);
   } else if (actualRoom == 0 && playerPositionBefore.left > 300 && playerPositionBefore.left <= 305 && playerPositionBefore.top >= 320 && playerPositionBefore.top <= 340 && (playerPosition.left < 300 || playerPosition.left > 305 || playerPosition.top < 320 || playerPosition.top > 340)) {
      playerElement.classList.remove("show-after"); // Klasse entfernen, um zusätzliches Bild auszublenden

      readButton(false);
   }
}

// Funktion zur Überprüfung der Position des Schranks im Raum 3
function checkRoom3WardrobePos(playerPosition, playerPositionBefore) {
   const playerElement = document.querySelector("#player");
   // Überprüfung, ob der Spieler sich in der Nähe des Schranks befindet und ob er sich im Raum 3 befindet
   if (playerPosition.left > 440 && playerPosition.left < 495 && playerPosition.top >= 20 && playerPosition.top < 40 && actualRoom == 3) {
      playerElement.classList.add("show-after"); // Klasse hinzufügen, um zusätzliches Bild anzuzeigen

      // Sende Nachricht mit Wert 0
      message = new Paho.MQTT.Message("1");
      message.destinationName = TOPIC_SEND_LDR;
      message.retained = true;
      console.log("< PUB", message.destinationName, "1");
      client.send(message);

      // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
      document.addEventListener("keydown", showWardrobe);
   } else if (actualRoom == 3 && playerPositionBefore.left > 440 && playerPositionBefore.left < 495 && playerPositionBefore.top >= 20 && playerPositionBefore.top < 40 && (playerPosition.left < 440 || playerPosition.left > 495 || playerPosition.top < 20 || playerPosition.top > 40)) {
      playerElement.classList.remove("show-after"); // Klasse entfernen, um zusätzliches Bild auszublenden

      // Entferne den Event-Listener
      document.removeEventListener("keydown", showWardrobe);

      // Sende Nachricht mit Wert 1
      message = new Paho.MQTT.Message("0");
      message.destinationName = TOPIC_SEND_LDR;
      message.retained = true;
      console.log("< PUB", message.destinationName, "0");
      client.send(message);

      const wardrobeElem = document.getElementById("wardrobe-open");
      wardrobeElem.style.display = "none";

      readLdr(false);
   }
}

// Funktion zum Lesen der Taste
function readButton(event) {
   if (event) {
      subscribe_topic(BUTTON3_TOPIC); // Funktion zum Abonnieren des Themas aufrufen
   } else {
      // Abonnement vom Thema BUTTON3_TOPIC kündigen
      client.unsubscribe(BUTTON3_TOPIC, {
         onSuccess: function () {
            console.log("Abonnement von " + BUTTON3_TOPIC + " gekündigt");
         }
      });
   }
}

// Funktion zum Umschalten des Lichts im Raum 3
function toggleLightRoom3() {
   const lightRoom3 = document.getElementById("lightRoom3");
   const lightSwitchRoom3 = document.getElementById("lightSwitch");

   // Berechnet den aktuellen Hintergrundstil des Lichtschalters
   const computedStyle = window.getComputedStyle(lightSwitchRoom3);
   const backgroundColor = computedStyle.backgroundColor;

   if (!lightRoom3State) {
      // Wenn der Lichtschalter aus ist, ändere ihn zu gelb und schalte das Licht ein
      lightRoom3State = true;
      lightSwitchRoom3.style.backgroundColor = "#fdf300";
      if (canMoveThroughDoor(3)) {
         lightRoom3.style.backgroundColor = "transparent";
         lightSwitch3Puzzle = true;
         lightSwitch3PuzzleFirstHelp = false;
      }
   } else {
      // Wenn der Lichtschalter an ist, ändere ihn zu weiß und schalte das Licht aus
      lightRoom3State = false;
      lightSwitchRoom3.style.backgroundColor = "#ffffff";
      lightRoom3.style.backgroundColor = "#000000f3";
   }
}

// Funktion zum Anzeigen des Schranks
function showWardrobe(event) {
   // Überprüft, ob die gedrückte Taste die Leertaste ist
   if (event.code === "Space") {
      const wardrobeElem = document.getElementById("wardrobe-open");
      wardrobeElem.style.display = "block"; // Schrank anzeigen
      readLdr(true); // Beginnt, den LDR-Sensor zu lesen
   }
}


// Funktion zum Lesen der Helligkeit
function readLdr(event) {
   if (event) {
      subscribe_topic(LDR_TOPIC); // Funktion zum Abonnieren des Themas aufrufen
   } else {
      // Abonnement vom Thema LDR_TOPIC kündigen
      client.unsubscribe(LDR_TOPIC, {
         onSuccess: function () {
            console.log("Abonnement von " + LDR_TOPIC + " gekündigt");
         }
      });
   }
}

// Funktion zur Anzeige des RFID-Chips
function showRfidChip(state) {
   const rfidElem = document.getElementById("rfid-chip");
   const wardrobeLightElem = document.getElementById("wardrobe-light");

   if (state) {
      // Licht des Schranks ausblenden
      wardrobeLightElem.style.opacity = "0";

      // Puzzle-Status aktualisieren
      wardrobePuzzle = true;
      wardrobePuzzleFirstHelp = false;
      puzzleSeconds = 0;

      if (rfidElem) {
         // RFID-Chip sichtbar machen
         rfidElem.style.opacity = "1";

         // Event-Listener hinzufügen, um den RFID-Chip beim Klicken zu entfernen
         rfidElem.addEventListener("click", (e) => {
            rfidElem.remove();
            document.getElementById("rfid-chip-bag").style.display = "block";
         });
      }

   } else {
      // Licht des Schranks wieder einblenden
      wardrobeLightElem.style.opacity = "1";

      if (rfidElem) {
         // RFID-Chip unsichtbar machen
         rfidElem.style.opacity = "0";
      }
   }
}


// Funktion zur Überprüfung der Position des rfid Lesegeräts im Raum 3
function checkRoom3ReaderPos(playerPosition, playerPositionBefore) {
   const playerElement = document.querySelector("#player");
   // Überprüfung, ob der Spieler sich in der Nähe des rfid Lesegeräts  befindet und ob er sich im Raum 3 befindet
   if (playerPosition.left >= 377 && playerPosition.left < 385 && playerPosition.top >= 140 && playerPosition.top <= 170 && actualRoom == 3) {
      playerElement.classList.add("show-after"); // Klasse hinzufügen, um zusätzliches Bild anzuzeigen

      if (document.getElementById("rfid-chip-bag").style.display != "") {
         // Sende Nachricht mit Wert 0
         message = new Paho.MQTT.Message("2");
         message.destinationName = RFID_SEND_TOPIC;
         message.retained = true;
         console.log("< PUB", message.destinationName, "2");
         client.send(message);

         subscribe_topic(RFID_UID_TOPIC);
      }

      // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
      document.addEventListener("keydown", checkRfid);
   } else if (actualRoom == 3 && playerPositionBefore.left >= 377 && playerPositionBefore.left < 385 && playerPositionBefore.top >= 140 && playerPositionBefore.top <= 170 && (playerPosition.left < 377 || playerPosition.left > 385 || playerPosition.top < 140 || playerPosition.top > 170)) {
      playerElement.classList.remove("show-after"); // Klasse entfernen, um zusätzliches Bild auszublenden

      // Sende Nachricht mit Wert 0
      message = new Paho.MQTT.Message("0");
      message.destinationName = RFID_SEND_TOPIC;
      message.retained = true;
      console.log("< PUB", message.destinationName, "0");
      client.send(message);

      // Entferne den Event-Listener
      document.removeEventListener("keydown", checkRfid);
      document.querySelector(".jumbotron").style.display = "none";
      jumbotronVisible = false; // Aktualisiere den Zustand auf unsichtbar
   }
}

function checkRfid(event) {
   if (event.code === "Space") {
      let jumbotronElem = document.querySelector(".jumbotron");

      if (jumbotronVisible) {
         jumbotronElem.style.display = "none";
         jumbotronVisible = false;
      } else {

         if (win && mirrorPuzzle && morseCodePuzzle && hexagonPuzzle && lightSwitch3Puzzle && wardrobePuzzle) {

            doorSound.play();
            clearInterval(updateTimeInterval);

            // Zugreifen auf das Tür-Element
            const door = document.querySelector(".door-master");
            door.setAttribute("data-state", "open");

            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;

            // Formatiere die Zeit
            const formattedTime = `${pad(minutes)}:${pad(secs)}`;

            jumbotronElem.innerHTML = `
                  <h2>👌 Mission Erfolgreich</h2>
                  <h3>Du hast alle Rätsel erfolgreich gelöst</h3>
                  <h3>Deine Zeit: ${formattedTime}</h3>
               `;

            jumbotronElem.style.display = "flex";
            jumbotronVisible = true;

         } else if (rfidCount >= 3) {
            jumbotronElem.innerHTML = `
                  <h2>!Mission gescheitert!</h2>
                  <h3>Das Haus bleibt nun für immer verschlossen!</h3>
               `;

            jumbotronElem.style.display = "flex";
            jumbotronVisible = true;
         } else {

            jumbotronElem.innerHTML = `
               <h2>!Warnung!</h2>
               <h3>Du hast noch ${3 - rfidCount} Versuche</h3>
            `;

            rfidCount++;

            jumbotronElem.style.display = "flex";
            jumbotronVisible = true;
         }
      }
   }
}

function checkRoom3TablePos(playerPosition, playerPositionBefore) {
   if (actualRoom == 3 && playerPosition.left >= 435 && playerPosition.left <= 500 && playerPosition.top >= 330 && playerPosition.top <= 345) {

      // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
      document.addEventListener("keydown", showWardrobePuzzleInfo);

   } else if (actualRoom == 3 && playerPositionBefore.left >= 435 && playerPositionBefore.left <= 500 && playerPositionBefore.top >= 330 && playerPositionBefore.top <= 345 && (playerPosition.left < 435 || playerPosition.left > 500 || playerPosition.top < 330 || playerPosition.top > 345)) {
      // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
      jumbotronElem.style.display = "none";

      jumbotronVisible = false;

      // Entferne den Event-Listener für das Tastaturereignis "keydown" hinzu
      document.removeEventListener("keydown", showWardrobePuzzleInfo);

   }
}
function showWardrobePuzzleInfo(event) {
   if (event.code === "Space") {
      let jumbotronElem = document.querySelector(".jumbotron");

      if (jumbotronVisible) {
         // Ursprüngliche Stile wiederherstellen, wenn das Jumbotron ausgeblendet wird
         jumbotronElem.style.display = "none";

         jumbotronVisible = false;
      } else {
         const today = new Date().toLocaleDateString();
         const Message = `
         <p><b>Hinweis:</b></p>
         <p>In der Dunkelheit liegt ein Geheimnis, erleuchte es, um es zu sehen.</p>
       `;
         jumbotronElem.innerHTML = Message;

         jumbotronElem.style.display = "flex";

         jumbotronVisible = true;
      }
   }
}