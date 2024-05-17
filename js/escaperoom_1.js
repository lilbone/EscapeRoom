// Initialisiere die Spielerposition
let playerPosition = {
   top: 0,
   left: 280,
};
// Variable, um den aktuellen Zustand des Jumbotrons zu verfolgen
let jumbotronVisible = false;
let actualRoom = 0;
let hexagonVisible =  false;
let hexagonCount = 0;

const itemObjects = [
   { id: 'morse-code', backpackId: 'morse-code-bag', top: 178, left: 183, width: 21, height: 36 },
];


document.addEventListener("keydown", function (event) {
   const player = document.getElementById("player");

   let playerPositionBefore = {
      top: 0,
      left: 0,
   };
   playerPositionBefore.left = playerPosition.left;
   playerPositionBefore.top = playerPosition.top;

   switch (event.key) {
      case "ArrowUp":
         playerPosition.top -= 15;
         // Spiele den Schrittklang ab
         playStepSound();
         break;
      case "ArrowDown":
         playerPosition.top += 15;
         // Spiele den Schrittklang ab
         playStepSound();
         break;
      case "ArrowLeft":
         playerPosition.left -= 15;
         // Spiele den Schrittklang ab
         playStepSound();
         break;
      case "ArrowRight":
         playerPosition.left += 15;
         // Spiele den Schrittklang ab
         playStepSound();
         break;
   }

   // Grenzen des Raumes überprüfen
   if (playerPosition.top < 0) playerPosition.top = 0;
   if (playerPosition.top > 550) playerPosition.top = 550;
   if (playerPosition.left < 0) playerPosition.left = 0;
   if (playerPosition.left > 550) playerPosition.left = 550;

   checkMoveRoom1RightWall(playerPositionBefore, playerPosition);

   checkMoveRoom1BottomWall(playerPositionBefore, playerPosition);

   checkMoveRoom2RightWall(playerPositionBefore, playerPosition);

   checkMoveRoom2TopWall(playerPositionBefore, playerPosition)

   checkMoveRoom3LeftWall(playerPositionBefore, playerPosition);

   //Room 1
   checkRoom1MirrorPos(playerPosition, playerPositionBefore);

   //room 2
   checkRoom2DoorPos(playerPosition);

   checkRoom2MorseCodePos(playerPosition, playerPositionBefore)

   checkHexagonPos(playerPosition);

   //room 3

   checkCollisionWithItems(playerPosition, playerPositionBefore)

   const isColliding = checkCollisionWithObjects(playerPosition, playerPositionBefore, actualRoom);

   if (!isColliding) {
      player.style.top = playerPosition.top + "px";
      player.style.left = playerPosition.left + "px";
   } else {
      player.style.top = playerPosition.top + "px";
      player.style.left = playerPosition.left + "px";
   }

});

function clearHexagon(elem)
{
   if (hexagonCount != 3) {
      elem.style.backgroundImage = "url('/images/general/hexagon-gray.png')";
      hexagonCount--;
   }
}

function checkHexagonPos(playerPosition) {
   if(hexagonVisible){
      if (actualRoom == 0 && playerPosition.left >= 280 && playerPosition.left <= 295 && playerPosition.top >= 515 && playerPosition.top <= 535) {
         const hexagon1Elem = document.getElementById("hexagon1");
         hexagon1Elem.style.backgroundImage = "url('/images/general/hexagon-blue.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(clearHexagon(hexagon1Elem), 19000);

      }
      if (actualRoom == 1 && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 155 && playerPosition.top <= 180) {
         const hexagon2Elem = document.getElementById("hexagon2");
         hexagon2Elem.style.backgroundImage = "url('/images/general/hexagon-green.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(clearHexagon(hexagon2Elem), 10000);
      }
      if (actualRoom == 2 && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 505 && playerPosition.top <= 530) {
         const hexagon3Elem = document.getElementById("hexagon3");
         hexagon3Elem.style.backgroundImage = "url('/images/general/hexagon-red.png')";
         hexagonSound.play();
         hexagonCount++;
         setTimeout(clearHexagon(hexagon3Elem), 5000);
      }
   }
}
