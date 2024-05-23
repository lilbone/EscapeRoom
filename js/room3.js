// Liste der Objekte im Raum 3
const room3Objects = [
   { id: "table-dining", top: 380, left: 440, width: 86, height: 150 },
   { id: "schrank", top: 0, left: 435, width: 99, height: 28 },
   { id: "reader", top: 160, left: 347, width: 30, height: 34 },
];

let rfidCount = 0;

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

      // Füge den Event-Listener für das Tastaturereignis "keydown" hinzu
      document.addEventListener("keydown", showWardrobe);
   } else if (actualRoom == 3 && playerPositionBefore.left > 440 && playerPositionBefore.left < 495 && playerPositionBefore.top >= 20 && playerPositionBefore.top < 40 && (playerPosition.left < 440 || playerPosition.left > 495 || playerPosition.top < 20 || playerPosition.top > 40)) {
      playerElement.classList.remove("show-after"); // Klasse entfernen, um zusätzliches Bild auszublenden

      // Entferne den Event-Listener
      document.removeEventListener("keydown", showWardrobe);

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

function toggleLightRoom3() {
   const lightRoom3 = document.getElementById("lightRoom3");
   const lightSwitchRoom3 = document.getElementById("lightSwitch");

   const computedStyle = window.getComputedStyle(lightSwitchRoom3);
   const backgroundColor = computedStyle.backgroundColor;

   if (backgroundColor == "rgb(255, 255, 255)") {

      lightSwitchRoom3.style.backgroundColor = "#fdf300";
      if (canMoveThroughDoor(3)) {
         lightRoom3.style.backgroundColor = "transparent";
      }

   } else {

      lightSwitchRoom3.style.backgroundColor = "#ffffff";
      lightRoom3.style.backgroundColor = "#000000f3";

   }

}

function showWardrobe(event) {
   if (event.key === "Enter") {
      const wardrobeElem = document.getElementById("wardrobe-open");
      wardrobeElem.style.display = "block";
      readLdr(true);
   }
}

// Funktion zum Lesen der Taste
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

function showRfidChip(state) {
   const rfidElem = document.getElementById("rfid-chip");
   const wardrobeLightElem = document.getElementById("wardrobe-light");
   if (state) {
      wardrobeLightElem.style.opacity = "0";

      if (rfidElem) {
         rfidElem.style.opacity = "1";

         rfidElem.addEventListener("click", (e) => {
            rfidElem.remove();
            document.getElementById("rfid-chip-bag").style.display = "block";
         })
      }

   } else {
      wardrobeLightElem.style.opacity = "1";
      if (rfidElem) {
         rfidElem.style.opacity = "0";
      }

   }
}

// Funktion zur Überprüfung der Position des rfid Lesegeräts im Raum 3
function checkRoom3ReaderPos(playerPosition, playerPositionBefore) {
   const playerElement = document.querySelector("#player");
   // Überprüfung, ob der Spieler sich in der Nähe des rfid Lesegeräts  befindet und ob er sich im Raum 3 befindet
   if (playerPosition.left >= 377 && playerPosition.left < 385 && playerPosition.top >= 150 && playerPosition.top <= 170 && actualRoom == 3) {
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
   } else if (actualRoom == 3 && playerPositionBefore.left >= 377 && playerPositionBefore.left < 385 && playerPositionBefore.top >= 150 && playerPositionBefore.top <= 170 && (playerPosition.left < 377 || playerPosition.left > 385 || playerPosition.top < 150 || playerPosition.top > 170)) {
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
   if (event.key === "Enter") {
      let jumbotronElem = document.querySelector(".jumbotron");

      if (jumbotronVisible) {
         jumbotronElem.style.display = "none";
         jumbotronVisible = false;
      } else {

         if (win) {

            doorSound.play();

            // Zugreifen auf das Tür-Element
            const door = document.querySelector(".door-master");
            door.setAttribute("data-state", "open");

            jumbotronElem.innerHTML = `
                  <h2>👌 Mission Erfolgreich</h2>
                  <h3>Du hast alle Rätsel erfolgreich gelöst</h3>
               `;

            jumbotronElem.style.display = "flex";
            jumbotronVisible = true;

         } else if (rfidCount == 2) {
            jumbotronElem.innerHTML = `
                  <h2>!Mission gescheitert!</h2>
                  <h3>Das Haus bleibt nun für immer verschlossen!</h3>
               `;

            jumbotronElem.style.display = "flex";
            jumbotronVisible = true;
         } else {

            if (document.getElementById("rfid-chip-bag").style.display == "") {

               jumbotronElem.innerHTML = `
                  <h2>!Warnung!</h2>
                  <h3>Du hast noch ${2 - rfidCount} Versuche</h3>
               `;

               rfidCount++;

               jumbotronElem.style.display = "flex";
               jumbotronVisible = true;
            }
         }

      }

   }
}