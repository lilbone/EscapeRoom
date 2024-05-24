// Initialisiere die Spielerposition
let playerPosition = {
   top: 0,
   left: 280,
};
// Variable, um den aktuellen Zustand des Jumbotrons zu verfolgen
let jumbotronVisible = false;
let actualRoom = 0;
let hexagonVisible = false;
let hexagon1Active = false;
let hexagon2Active = false;
let hexagon3Active = false;
let seconds = 0;

// Variablen für die Rätsel
let puzzleSeconds = 0;
let mirrorPuzzle = false;
let mirrorPuzzleFirstHelp = false;
let morseCodePuzzle = false;
let morseCodePuzzleFirstHelp = false;

// Liste der Gegenstandsobjekte
const itemObjects = [
   { id: 'morse-code', backpackId: 'morse-code-bag', top: 178, left: 183, width: 21, height: 36 },
   { id: 'lightSwitchLabel', backpackId: 'lightSwitchLabel-bag', top: 390, left: 10, width: 13, height: 50 },
];

// Jumbotron-Element
let jumbotronElem = document.querySelector(".jumbotron");
// Willkommensnachricht im Jumbotron anzeigen
jumbotronElem.innerHTML = `
   <h2>Willkommen</h2>
   <p>Du bist in einem alten, verlassenen Herrenhaus gefangen. Um zu entkommen, musst du eine Reihe kniffliger Rätsel lösen. Nutze die versteckten Hinweise und zeige, 
   dass du scharfsinnig genug bist, um den Weg nach draußen zu finden. Deine Zeit läuft - kannst du das Geheimnis des Hauses lüften und entkommen?</p><p>Tipp: Nutze den ESP und den Computersound um die Rätsel zu lösen.</p>
   <p style="display: flex; gap: 10px;"><img src="images/control/enter-key.png" height="20" alt=""><span>Drücke die Enter Taste zum Starten</span></p>
`;
jumbotronElem.style.display = "flex"; // Jumbotron sichtbar machen
jumbotronVisible = true; // Jumbotron ist sichtbar

function pad(value) {
   return value.toString().padStart(2, '0');
}

function updateTime() {
   // Berechne Minuten und Sekunden
   const minutes = Math.floor(seconds / 60);
   const secs = seconds % 60;

   // Formatiere die Zeit
   const formattedTime = `Time: ${pad(minutes)}:${pad(secs)}`;

   // Aktualisiere den Inhalt des <h2>-Elements
   document.querySelector("#time h2").textContent = formattedTime;

   // Überprüfe, die Zeit für jeweiliges Rätsel
   const mirrorPuzzleHelpElem = document.getElementById("mirror-puzzle-help");
   if (!mirrorPuzzle) {
      if (puzzleSeconds == 3 && !mirrorPuzzleFirstHelp) {
         mirrorPuzzleFirstHelp = true;
         newNotificationSound.play();
         mirrorPuzzleHelpElem.style.display = "block";
      }
   }else{
      mirrorPuzzleHelpElem.style.display = "none";
   }

   const morseCodePuzzleHelpElem = document.getElementById("morseCode-puzzle-help");
   if (!morseCodePuzzle && mirrorPuzzle) {
      if (puzzleSeconds == 3 && !morseCodePuzzleFirstHelp) {
         morseCodePuzzleFirstHelp = true;
         newNotificationSound.play();
         morseCodePuzzleHelpElem.style.display = "block";
      }
   }else{
      morseCodePuzzleHelpElem.style.display = "none";
   }


   // Erhöhe die Sekunden um 1
   seconds++;
   puzzleSeconds++;
}

function hideJumbotron() {
   // Verstecke das Jumbotron-Element
   const jumbotron = document.querySelector(".jumbotron");
   if (jumbotron) {
      jumbotron.style.display = "none";
      jumbotronVisible = false; // Aktualisiere den Zustand auf unsichtbar

      // Entferne den Event-Listener, um Mehrfachausführungen zu verhindern
      document.removeEventListener("keydown", hideJumbotron);
   }

   // Starte den Timer und aktualisiere die Zeit jede Sekunde
   setInterval(updateTime, 1000);

   // Rufe die Funktion sofort auf, um den initialen Wert zu setzen
   updateTime();
}

// Füge den Event-Listener hinzu
document.addEventListener("keydown", hideJumbotron);


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
   checkMoveRoom2TopWall(playerPositionBefore, playerPosition);

   // Kollision mit der linken Wand von Raum 3 überprüfen
   checkMoveRoom3LeftWall(playerPositionBefore, playerPosition);

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

   // Kollisionen in Raum 1 überprüfen
   checkRoom1MirrorPos(playerPosition, playerPositionBefore);
   if (!mirrorPuzzle && mirrorPuzzleFirstHelp) {
      checkRoom1PcPos(playerPosition, playerPositionBefore);
   }

   // Kollision in Raum 2 überprüfen
   checkRoom2DoorPos(playerPosition, playerPositionBefore);
   checkRoom2MorseCodePos(playerPosition, playerPositionBefore);
   if (!morseCodePuzzle && morseCodePuzzleFirstHelp) {
      checkRoom2TablePos(playerPosition, playerPositionBefore);
   }

   // Kollision in Raum 3 überprüfen
   checkRoom3LightSwitchPos(playerPosition, playerPositionBefore);
   checkRoom3WardrobePos(playerPosition, playerPositionBefore);
   checkRoom3ReaderPos(playerPosition, playerPositionBefore);

   // Kollision mit dem Hexagon überprüfen
   checkHexagonPos(playerPosition);

   // Kollision mit Gegenständen überprüfen
   checkCollisionWithItems(playerPosition, playerPositionBefore);

});

function clearHexagon(elem, hexagonActive) {

   if (!hexagon1Active || !hexagon2Active || !hexagon3Active) {
      hexagonOffSound.play();
      elem.style.backgroundImage = "url('/images/general/hexagon-gray.png')";
      if (hexagonActive == 1) {
         hexagon1Active = false;
      } else if (hexagonActive == 2) {
         hexagon2Active = false;
      } else {
         hexagon3Active = false;
      }
   }
}

// Funktion zum Überprüfen der Position des Hexagons
function checkHexagonPos(playerPosition) {
   if (hexagonVisible) {
      if (actualRoom == 0 && !hexagon1Active && playerPosition.left >= 280 && playerPosition.left <= 295 && playerPosition.top >= 515 && playerPosition.top <= 535) {
         const hexagon1Elem = document.getElementById("hexagon1");
         hexagon1Elem.style.backgroundImage = "url('/images/general/hexagon-blue.png')";
         hexagonSound.play();
         hexagon1Active = true;
         setTimeout(() => clearHexagon(hexagon1Elem, 1), 14000);
      }
      if (actualRoom == 1 && !hexagon2Active && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 155 && playerPosition.top <= 180) {
         const hexagon2Elem = document.getElementById("hexagon2");
         hexagon2Elem.style.backgroundImage = "url('/images/general/hexagon-green.png')";
         hexagonSound.play();
         hexagon2Active = true;
         setTimeout(() => clearHexagon(hexagon2Elem, 2), 3000);
         if (hexagon1Active && hexagon2Active && hexagon3Active) {
            let door = document.querySelector(".door-3");
            // Ändern des data-state-Attributs auf "open"
            doorSound.play();
            door.setAttribute("data-state", "open");
         }
      }
      if (actualRoom == 2 && !hexagon3Active && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 505 && playerPosition.top <= 530) {
         const hexagon3Elem = document.getElementById("hexagon3");
         hexagon3Elem.style.backgroundImage = "url('/images/general/hexagon-red.png')";
         hexagonSound.play();
         hexagon3Active = true;
         setTimeout(() => clearHexagon(hexagon3Elem, 3), 8000);
      }
   }
}
