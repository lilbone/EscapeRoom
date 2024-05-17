function checkMoveRoom3LeftWall(playerPositionBefore, playerPosition) {
  // Raum 3 Linke Wand
  if (playerPositionBefore.left <= 305 && playerPosition.left > 305) {
     if (!(playerPosition.top >= 260 && playerPosition.top <= 290 && canMoveThroughDoor(3))) {
        playerPosition.left = 305;
        actualRoom = 0;
     } else {
        playerPosition.left = 348;
        actualRoom = 3;
     }
  }

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