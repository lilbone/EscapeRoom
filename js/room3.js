// Liste der Objekte im Raum 3
const room3Objects = [
   { id: "table-dining", top: 380, left: 440, width: 86, height: 150 },
   { id: "schrank", top: 0, left: 435, width: 99, height: 28 },
];

let subButton = false;

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
   if (playerPosition.left > 300 && playerPosition.left <= 305 && playerPosition.top > 320 && playerPosition.top < 340 && actualRoom == 0) {
      playerElement.classList.add("show-after"); // Klasse hinzufügen, um zusätzliches Bild anzuzeigen

      // Event-Listener für das Tastaturereignis "keydown" hinzufügen, um die Taste zu lesen
      readButton(true);
   } else if (actualRoom == 0 && playerPositionBefore.left > 300 && playerPositionBefore.left <= 305 && playerPositionBefore.top > 320 && playerPositionBefore.top < 340) {
      playerElement.classList.remove("show-after"); // Klasse entfernen, um zusätzliches Bild auszublenden

      readButton(false);
   }
}

// Funktion zum Lesen der Taste
function readButton(event) {
   if (subButton == false) {
      subscribe_topic("esp/btn1"); // Funktion zum Abonnieren des Themas aufrufen
      subButton = true;
   } else {
      // Abonnement vom Thema "esp/btn1" kündigen
      client.unsubscribe("esp/btn1", {
         onSuccess: function () {
            console.log("Abonnement von " + "esp/btn1" + " gekündigt");
         }
      });
   }
}
