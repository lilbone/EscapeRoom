// Initialisiere die Spielerposition
let playerPosition = {
   top: 0,
   left: 280,
};
let jumbotronVisible = false; // Variable, um den aktuellen Zustand des Jumbotrons zu verfolgen
let actualRoom = 0; // Aktueller Raum
let hexagonVisible = false; // Variable, um den sichtbaren Zustand des Hexagons zu verfolgen
let hexagonCount = 0; // Anzahl der gesammelten Hexagone

// Liste der Gegenstandsobjekte
const itemObjects = [
   { id: 'morse-code', backpackId: 'morse-code-bag', top: 178, left: 183, width: 21, height: 36 },
];

// Jumbotron-Element
let jumbotronElem = document.querySelector(".jumbotron");
// Willkommensnachricht im Jumbotron anzeigen
jumbotronElem.innerHTML = `
   <h2>Willkommen</h2>
   <p>Du bist in einem alten, verlassenen Herrenhaus gefangen. Um zu entkommen, musst du eine Reihe kniffliger Rätsel lösen. Nutze die versteckten Hinweise und zeige, 
   dass du scharfsinnig genug bist, um den Weg nach draußen zu finden. Deine Zeit läuft - kannst du das Geheimnis des Hauses lüften und entkommen?</p>
   <p style="display: flex; gap: 10px;"><img src="images/control/enter-key.png" height="20" alt=""><span>Drücke die Enter Taste zum Starten</span></p>
`;
jumbotronElem.style.display = "flex"; // Jumbotron sichtbar machen
jumbotronVisible = true; // Jumbotron ist sichtbar

// Event-Listener für Tastatureingaben hinzufügen
document.addEventListener("keydown", function (event) {
   const player = document.getElementById("player");

   // Vorherige Spielerposition speichern
   let playerPositionBefore = {
      top: 0,
      left: 0,
   };
   playerPositionBefore.left = playerPosition.left;
   playerPositionBefore.top = playerPosition.top;

   // Spielerbewegung basierend auf der gedrückten Pfeiltaste
   switch (event.key) {
      case "ArrowUp":
         playerPosition.top -= 15;
         playStepSound(); // Schrittklang abspielen
         break;
      case "ArrowDown":
         playerPosition.top += 15;
         playStepSound(); // Schrittklang abspielen
         break;
      case "ArrowLeft":
         playerPosition.left -= 15;
         playStepSound(); // Schrittklang abspielen
         break;
      case "ArrowRight":
         playerPosition.left += 15;
         playStepSound(); // Schrittklang abspielen
         break;
   }

   // Spielerposition begrenzen
   if (playerPosition.top < 0) playerPosition.top = 0;
   if (playerPosition.top > 550) playerPosition.top = 550;
   if (playerPosition.left < 0) playerPosition.left = 0;
   if (playerPosition.left > 550) playerPosition.left = 550;

   // Kollision mit der rechten Wand von Raum 1 überprüfen
   checkMoveRoom1RightWall(playerPositionBefore, playerPosition);

   // Kollision mit der unteren Wand von Raum 1 überprüfen
   checkMoveRoom1BottomWall(playerPositionBefore, playerPosition);

   // Kollision mit der rechten Wand von Raum 2 überprüfen
   checkMoveRoom2RightWall(playerPositionBefore, playerPosition);

   // Kollision mit der oberen Wand von Raum 2 überprüfen
   checkMoveRoom2TopWall(playerPositionBefore, playerPosition)

   // Kollision mit der linken Wand von Raum 3 überprüfen
   checkMoveRoom3LeftWall(playerPositionBefore, playerPosition);

   // Kollision mit dem Spiegel in Raum 1 überprüfen
   checkRoom1MirrorPos(playerPosition, playerPositionBefore);

   // Kollision mit der Tür in Raum 2 überprüfen
   checkRoom2DoorPos(playerPosition);

   // Kollision mit dem Morse-Code in Raum 2 überprüfen
   checkRoom2MorseCodePos(playerPosition, playerPositionBefore)

   // Kollision mit dem Hexagon überprüfen
   checkHexagonPos(playerPosition);

   // Kollision mit dem Lichtschalter in Raum 3 überprüfen
   checkRoom3LightSwitchPos(playerPosition, playerPositionBefore);

   // Kollision mit Gegenständen überprüfen
   checkCollisionWithItems(playerPosition, playerPositionBefore)

   // Kollision mit Objekten in den Räumen überprüfen
   const isColliding = checkCollisionWithObjects(playerPosition, playerPositionBefore, actualRoom);

   // Spielerposition aktualisieren, wenn keine Kollision vorliegt
   if (!isColliding) {
      player.style.top = playerPosition.top + "px";
      player.style.left = playerPosition.left + "px";
   } else {
      player.style.top = playerPosition.top + "px";
      player.style.left = playerPosition.left + "px";
   }

});

// Funktion zum Zurücksetzen des Hexagons
function clearHexagon(elem) {
   if (hexagonCount != 3) {
      elem.style.backgroundImage = "url('/images/general/hexagon-gray.png')";
      hexagonCount--;
   }
}

// Funktion zum Überprüfen der Position des Hexagons
function checkHexagonPos(playerPosition) {
   if (hexagonVisible) {
      // Raum 1: Position des ersten Hexagons überprüfen
      if (actualRoom == 0 && playerPosition.left >= 280 && playerPosition.left <= 295 && playerPosition.top >= 515 && playerPosition.top <= 535) {
         const hexagon1Elem = document.getElementById("hexagon1");
         hexagon1Elem.style.backgroundImage = "url('/images/general/hexagon-blue.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(() => clearHexagon(hexagon1Elem), 19000);
      }
      // Raum 2: Position des zweiten Hexagons überprüfen
      if (actualRoom == 1 && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 155 && playerPosition.top <= 180) {
         const hexagon2Elem = document.getElementById("hexagon2");
         hexagon2Elem.style.backgroundImage = "url('/images/general/hexagon-green.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(() => clearHexagon(hexagon2Elem), 10000);
      }
      // Raum 3: Position des dritten Hexagons überprüfen
      if (actualRoom == 2 && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 505 && playerPosition.top <= 530) {
         const hexagon3Elem = document.getElementById("hexagon3");
         hexagon3Elem.style.backgroundImage = "url('/images/general/hexagon-red.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(clearHexagon(hexagon3Elem), 5000);
      }
   }
}
