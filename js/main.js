/* ################################################################
 Filename      : main.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Initialisierung von Variablen
let playerSize = 35; // Größe des Spielers in Pixel
let win = false; // Zustand des Spiels: gewonnen oder nicht
let loose = false;

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

// Funktion zum Abspielen des Schrittgeräusches
function playStepSound() {
    stepSound.play();
}

// Funktion zum Abspielen der Hintergrundmusik
function playThemeSound() {
    const themeSound_1 = new Audio('../sounds/Final Fantasy V - A Presentiment.mp3');
    themeSound_1.volume = 0.1;
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

        if (playerPositionBefore.left >= objectRight && playerPosition.left < objectRight && playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom ) {
            // Spieler kollidiert mit dem Objekt von rechts
            playerPosition.left = objectRight;
            return true;
        } else if (playerPositionBefore.left + playerSize <= objectLeft && playerPosition.left + playerSize > objectLeft && playerPosition.top + playerSize > objectTop && playerPosition.top < objectBottom ) {
            // Spieler kollidiert mit dem Objekt von links
            playerPosition.left = objectLeft - playerSize;
            return true;
        } else if (playerPositionBefore.top >= objectBottom && playerPosition.top < objectBottom && playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight ) {
            // Spieler kollidiert mit dem Objekt von unten
            playerPosition.top = objectBottom;
            return true;
        } else if (playerPositionBefore.top + playerSize <= objectTop && playerPosition.top + playerSize > objectTop && playerPosition.left + playerSize > objectLeft && playerPosition.left < objectRight ) {
            // Spieler kollidiert mit dem Objekt von oben
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
        if ( playerPositionBefore.left >= itemRight && playerPosition.left < itemRight && playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if ( playerPositionBefore.left + playerSize <= itemLeft && playerPosition.left + playerSize > itemLeft && playerPosition.top + playerSize > itemTop && playerPosition.top < itemBottom ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if ( playerPositionBefore.top >= itemBottom && playerPosition.top < itemBottom && playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        } else if ( playerPositionBefore.top + playerSize <= itemTop && playerPosition.top + playerSize > itemTop && playerPosition.left + playerSize > itemLeft && playerPosition.left < itemRight ) {
            document.getElementById(item.backpackId).style.display = "block"; // Gegenstand in den Rucksack verschieben
            document.getElementById(item.id).style.display = "none"; // Gegenstand aus dem Raum entfernen
            return true;
        }
    }

    // Keine Kollision mit Gegenständen
    return false;
}

function restartGame(){
    // Reset aller mqttt-subs
    message = new Paho.MQTT.Message("0");
    message.destinationName = TOPIC_SEND_LDR;
    message.retained = true;
    console.log("< PUB", message.destinationName, "0");
    client.send(message);

    message = new Paho.MQTT.Message("0");
    message.destinationName = RFID_SEND_TOPIC;
    message.retained = true;
    console.log("< PUB", message.destinationName, "0");
    client.send(message);
    

    window.location.reload();
}