let playerSize = 35;

let themeSoundIsPlaying = false;

const stepSound = new Audio('../sounds/step2.mp3'); // Lade die Audio-Datei
stepSound.volume = 0.4;
const doorSound = new Audio('../sounds/dooropened.mp3'); // Lade die Audio-Datei
doorSound.volume = 0.8;
const hexagonSound = new Audio('../sounds/hexagon.mp3'); // Lade die Audio-Datei
hexagonSound.volume = 0.9;

if (!themeSoundIsPlaying) {
    //playThemeSound();
    themeSoundIsPlaying = true;
}

function playStepSound() {
    stepSound.play();
}

function playThemeSound() {
    const themeSound_1 = new Audio('../sounds/Final Fantasy V - A Presentiment.mp3');
    themeSound_1.volume = 0.2;
    themeSound_1.loop = true; // Setze die Dauerschleife

    themeSound_1.play(); // Starte die Wiedergabe
}

function canMoveThroughDoor(number) {
    const door = document.querySelector(`.door-${number}`);
    return door.dataset.state === "open";
}

function checkCollisionWithObjects(playerPosition, playerPositionBefore, room) {
    // Wähle die Liste der Gegenstände entsprechend des Raums aus
    let roomObjects;
    if (room === 1) {
        roomObjects = room1Objects;
    } else if (room === 2) {
        roomObjects = room2Objects;
    } else if (room === 3) {
        roomObjects = room3Objects;
    } else {
        // Definiere für weitere Räume entsprechende Listen oder andere Logik
        roomObjects = []; // leere Liste, falls kein Raum gefunden wurde
    }

    // Überprüfe jede Gegenstandsposition im aktuellen Raum
    for (const object of roomObjects) {
        // Berechne die Grenzen des Gegenstands
        const objectLeft = object.left;
        const objectRight = object.left + object.width;
        const objectTop = object.top;
        const objectBottom = object.top + object.height;

        // Überprüfe, ob der Spieler mit dem Gegenstand kollidiert
        if (
            playerPositionBefore.left >= objectRight && playerPosition.left < objectRight && // Kollision von links
            playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom // Spielerhöhe ist 35px
        ) {
            // Spieler kollidiert mit dem Gegenstand von links
            playerPosition.left = objectRight;
            return true;
        } else if (
            playerPositionBefore.left + playerSize <= objectLeft && playerPosition.left + playerSize > objectLeft && // Kollision von rechts
            playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom // Spielerhöhe ist 35px
        ) {
            // Spieler kollidiert mit dem Gegenstand von rechts
            playerPosition.left = objectLeft - playerSize;
            return true;
        } else if (
            playerPositionBefore.top >= objectBottom && playerPosition.top < objectBottom && // Kollision von oben
            playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight // Spielerbreite ist 35px
        ) {
            // Spieler kollidiert mit dem Gegenstand von oben
            playerPosition.top = objectBottom;
            return true;
        } else if (
            playerPositionBefore.top + playerSize <= objectTop && playerPosition.top + playerSize > objectTop && // Kollision von unten
            playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight // Spielerbreite ist 35px
        ) {
            // Spieler kollidiert mit dem Gegenstand von unten
            playerPosition.top = objectTop - playerSize;
            return true;
        }
    }

    // Spieler kollidiert mit keinem Gegenstand
    return false;
}

function checkCollisionWithItems(playerPosition, playerPositionBefore) {
    // Wähle die Liste der Gegenstände entsprechend des Raums aus

    let items = itemObjects;

    // Überprüfe jede Gegenstandsposition im aktuellen Raum
    for (const item of items) {
        // Berechne die Grenzen des Gegenstands
        const itemLeft = item.left;
        const itemRight = item.left + item.width;
        const itemTop = item.top;
        const itemBottom = item.top + item.height;

        // Überprüfe, ob der Spieler mit dem Gegenstand kollidiert
        if (
            playerPositionBefore.left >= itemRight && playerPosition.left < itemRight && // Kollision von links
            playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom // Spielerhöhe ist 50px
        ) {
            document.getElementById(item.backpackId).style.display = "block";
            document.getElementById(item.id).style.display = "none";
            return true;
        } else if (
            playerPositionBefore.left + playerSize <= itemLeft && playerPosition.left + playerSize > itemLeft && // Kollision von rechts
            playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom // Spielerhöhe ist 50px
        ) {
            document.getElementById(item.backpackId).style.display = "block";
            document.getElementById(item.id).style.display = "none";
            return true;
        } else if (
            playerPositionBefore.top >= itemBottom && playerPosition.top < itemBottom && // Kollision von oben
            playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight // Spielerbreite ist 50px
        ) {
            document.getElementById(item.backpackId).style.display = "block";
            document.getElementById(item.id).style.display = "none";
            return true;
        } else if (
            playerPositionBefore.top + playerSize <= itemTop && playerPosition.top + playerSize > itemTop && // Kollision von unten
            playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight // Spielerbreite ist 50px
        ) {
            document.getElementById(item.backpackId).style.display = "block";
            document.getElementById(item.id).style.display = "none";
            return true;
        }
    }

    // Spieler kollidiert mit keinem Item
    return false;
}