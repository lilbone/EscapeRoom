/* ################################################################
 Filename      : main.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Initialisierung von Variablen
let playerSize = 35; // Größe des Spielers in Pixel
let win = false; // Zustand des Spiels: gewonnen oder nicht

let themeSoundIsPlaying = false; // Zustand der Hintergrundmusik: spielt oder nicht

// Laden und Einstellen der Audiodateien
const stepSound = new Audio('../sounds/step2.mp3');
stepSound.volume = 0.4;
const doorSound = new Audio('../sounds/dooropened.mp3');
doorSound.volume = 0.8;
const hexagonSound = new Audio('../sounds/hexagon.mp3');
hexagonSound.volume = 0.9;
const hexagonOffSound = new Audio('../sounds/hexagon-off.mp3');
hexagonSound.volume = 0.9;
const newNotificationSound = new Audio('../sounds/new-notification.mp3');
newNotificationSound.volume = 0.9;
const lightAmpSound = new Audio('../sounds/light-amp.mp3');
lightAmpSound.volume = 0.7;

// Starten der Hintergrundmusik, falls sie nicht bereits spielt
if (!themeSoundIsPlaying) {
    // playThemeSound(); // Kommentar entfernt, da Funktion nicht definiert
    themeSoundIsPlaying = true;
}

// Funktion zum Abspielen des Schrittgeräusches
function playStepSound() {
    stepSound.play();
}

// Funktion zum Abspielen der Hintergrundmusik
function playThemeSound() {
    const themeSound_1 = new Audio('../sounds/Final Fantasy V - A Presentiment.mp3');
    themeSound_1.volume = 0.2;
    themeSound_1.loop = true; // Dauerschleife aktivieren

    themeSound_1.play(); // Wiedergabe starten
}

// Funktion zum Überprüfen, ob eine Tür geöffnet ist
function canMoveThroughDoor(number) {
    const door = document.querySelector(`.door-${number}`);
    return door.dataset.state === "open";
}

// Funktion zur Überprüfung von Kollisionen mit Objekten im Raum
function checkCollisionWithObjects(playerPosition, playerPositionBefore, room) {
    // Auswahl der Objekte im aktuellen Raum
    let roomObjects;
    if (room === 1) {
        roomObjects = room1Objects;
    } else if (room === 2) {
        roomObjects = room2Objects;
    } else if (room === 3) {
        roomObjects = room3Objects;
    } else {
        roomObjects = []; // Leere Liste, falls kein Raum gefunden wurde
    }

    // Überprüfung jeder Objektposition im aktuellen Raum
    for (const object of roomObjects) {
        // Berechnung der Objektgrenzen
        const objectLeft = object.left;
        const objectRight = object.left + object.width;
        const objectTop = object.top;
        const objectBottom = object.top + object.height;

        // Überprüfung, ob der Spieler mit dem Objekt kollidiert
        if (
            playerPositionBefore.left >= objectRight && playerPosition.left < objectRight && // Kollision von links
            playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom // Spielerhöhe ist 35px
        ) {
            // Spieler kollidiert mit dem Objekt von links
            playerPosition.left = objectRight;
            return true;
        } else if (
            playerPositionBefore.left + playerSize <= objectLeft && playerPosition.left + playerSize > objectLeft && // Kollision von rechts
            playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom // Spielerhöhe ist 35px
        ) {
            // Spieler kollidiert mit dem Objekt von rechts
            playerPosition.left = objectLeft - playerSize;
            return true;
        } else if (
            playerPositionBefore.top >= objectBottom && playerPosition.top < objectBottom && // Kollision von oben
            playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight // Spielerbreite ist 35px
        ) {
            // Spieler kollidiert mit dem Objekt von oben
            playerPosition.top = objectBottom;
            return true;
        } else if (
            playerPositionBefore.top + playerSize <= objectTop && playerPosition.top + playerSize > objectTop && // Kollision von unten
            playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight // Spielerbreite ist 35px
        ) {
            // Spieler kollidiert mit dem Objekt von unten
            playerPosition.top = objectTop - playerSize;
            return true;
        }
    }

    // Keine Kollision mit Objekten
    return false;
}

// Funktion zur Überprüfung von Kollisionen mit Gegenständen im Raum
function checkCollisionWithItems(playerPosition, playerPositionBefore) {
    // Auswahl der Gegenstände im aktuellen Raum
    let items = itemObjects;

    // Überprüfung jeder Gegenstandsposition im aktuellen Raum
    for (const item of items) {
        // Berechnung der Gegenstandsgrenzen
        const itemLeft = item.left;
        const itemRight = item.left + item.width;
        const itemTop = item.top;
        const itemBottom = item.top + item.height;

        // Überprüfung, ob der Spieler mit dem Gegenstand kollidiert
        if (
            playerPositionBefore.left >= itemRight && playerPosition.left < itemRight && // Kollision von links
            playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom // Spielerhöhe ist 35px
        ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if (
            playerPositionBefore.left + playerSize <= itemLeft && playerPosition.left + playerSize > itemLeft && // Kollision von rechts
            playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom // Spielerhöhe ist 35px
        ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if (
            playerPositionBefore.top >= itemBottom && playerPosition.top < itemBottom && // Kollision von oben
            playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight // Spielerbreite ist 35px
        ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if (
            playerPositionBefore.top + playerSize <= itemTop && playerPosition.top + playerSize > itemTop && // Kollision von unten
            playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight // Spielerbreite ist 35px
        ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        }
    }

    // Keine Kollision mit Gegenständen
    return false;
}
