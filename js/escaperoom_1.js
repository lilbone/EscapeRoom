/* ################################################################
 Filename      : escaperoom_1.js
 Author        : Bohn Matthias
 Date          : 26.05.2024
################################################################ */
// Initialisiere die Spielerposition
let playerPosition = {
    top: 0,
    left: 280,
};

// Variablen zur Verfolgung des aktuellen Zustands
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
let lightSwitch3Puzzle = false;
let lightSwitch3PuzzleFirstHelp = false;
let hexagonPuzzle = false;
let hexagonPuzzleFirstHelp = false;
let wardrobePuzzle = false;
let wardrobePuzzleFirstHelp = false;

let updateTimeInterval;

// Liste der Gegenstandsobjekte
const itemObjects = [
    { id: 'morse-code', backpackId: 'morse-code-bag', top: 178, left: 183, width: 21, height: 36 },
    { id: 'lightSwitchLabel', backpackId: 'lightSwitchLabel-bag', top: 390, left: 10, width: 13, height: 50 },
];

//Delete LocalStorage remove line comment
//localStorage.removeItem("playerNames");

//read localstorage playernames and write it in p tags
const playerNameList = document.getElementById("player-list");
playerNameList.innerHTML = "";
const storedPlayerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
storedPlayerNames.forEach((player) => {
    const p = document.createElement("p");
    p.innerHTML = `<span>${player.name}:</span><span>${player.time}</span>`;
    playerNameList.appendChild(p);
});

// Jumbotron-Element
let jumbotronElem = document.querySelector(".jumbotron");

// Willkommensnachricht im Jumbotron anzeigen
jumbotronElem.innerHTML = `
    <div id="welcome">
        <div style="display: flex; gap: 6px; flex-direction: column;">
            <h2>Willkommen</h2>
            <p><b>Bitte gib deinen/eure Namen ein</b></p>
            <input type="text" id="player-name" maxlength="22">
            <p style="text-align:justify;">
                Du bist in einem alten, verlassenen Herrenhaus gefangen. Um zu entkommen, musst du eine Reihe kniffliger
                Rätsel mit
                Hilfe eines Microcontrollers lösen. Nutze die versteckten Hinweise und zeige, dass du scharfsinnig genug
                bist, um
                den Weg nach draußen zu finden. Deine Zeit läuft - kannst du das Geheimnis des Hauses lüften und entkommen?
            </p>
            <p>Tipp: Schau das Video zum Microcontroller.</p>
            
        </div>
        <div>
            <video src="./images/general/Esp-Video.mp4" height="320" controls="true"></video>
        </div>
    </div>
    <p style="display: flex; gap: 10px;">
        <img src="images/control/enter-key.png" height="20" alt="">
        <span>Drücke die Enter-Taste zum Starten</span>
    </p>
`;
jumbotronElem.style.display = "flex"; // Jumbotron sichtbar machen
jumbotronElem.style.maxWidth = "600px";
jumbotronVisible = true; // Zustand aktualisieren

// Funktion zur Zeitformatierung
function pad(value) {
    return value.toString().padStart(2, '0');
}

// Funktion zur Zeitaktualisierung
function updateTime() {
    // Berechne Minuten und Sekunden
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    // Formatiere die Zeit
    const formattedTime = `Time: ${pad(minutes)}:${pad(secs)}`;

    // Aktualisiere die Zeitanzeige
    document.querySelector("#time h2").textContent = formattedTime;

    // Überprüfe die Zeit für die jeweiligen Rätsel und zeige Hilfetexte an
    const mirrorPuzzleHelpElem = document.getElementById("puzzle-helper-room1");
    if (!mirrorPuzzle) {
        if (puzzleSeconds == 10 && !mirrorPuzzleFirstHelp) {
            mirrorPuzzleFirstHelp = true;
            newNotificationSound.play();
            mirrorPuzzleHelpElem.style.display = "block";
        }
    } else if (!lightSwitch3PuzzleFirstHelp && !mirrorPuzzleFirstHelp) {
        mirrorPuzzleHelpElem.style.display = "none";
    }

    const morseCodePuzzleHelpElem = document.getElementById("puzzle-helper-room2");
    if (!morseCodePuzzle && mirrorPuzzle) {
        if (puzzleSeconds == 10 && !morseCodePuzzleFirstHelp) {
            morseCodePuzzleFirstHelp = true;
            newNotificationSound.play();
            morseCodePuzzleHelpElem.style.display = "block";
        }
    } else if (!hexagonPuzzleFirstHelp && !morseCodePuzzleFirstHelp) {
        morseCodePuzzleHelpElem.style.display = "none";
    }

    const hexagonPuzzleHelpElem = document.getElementById("puzzle-helper-room2");
    if (!hexagonPuzzle && mirrorPuzzle && morseCodePuzzle) {
        if (puzzleSeconds == 10 && !hexagonPuzzleFirstHelp) {
            hexagonPuzzleFirstHelp = true;
            newNotificationSound.play();
            hexagonPuzzleHelpElem.style.display = "block";
        }
    } else if (!hexagonPuzzleFirstHelp && !morseCodePuzzleFirstHelp) {
        hexagonPuzzleHelpElem.style.display = "none";
    }

    const lightSwitch3PuzzleHelpElem = document.getElementById("puzzle-helper-room1");
    if (!lightSwitch3Puzzle && mirrorPuzzle && morseCodePuzzle && hexagonPuzzle) {
        if (puzzleSeconds == 10 && !lightSwitch3PuzzleFirstHelp) {
            lightSwitch3PuzzleFirstHelp = true;
            newNotificationSound.play();
            lightSwitch3PuzzleHelpElem.style.display = "block";
        }
    } else if (!lightSwitch3PuzzleFirstHelp && !mirrorPuzzleFirstHelp) {
        lightSwitch3PuzzleHelpElem.style.display = "none";
    }

    const wardrobePuzzleHelpElem = document.getElementById("puzzle-helper-room3");
    if (!wardrobePuzzle && mirrorPuzzle && morseCodePuzzle && hexagonPuzzle && lightSwitch3Puzzle) {
        if (puzzleSeconds == 10 && !wardrobePuzzleFirstHelp) {
            wardrobePuzzleFirstHelp = true;
            newNotificationSound.play();
            wardrobePuzzleHelpElem.style.display = "block";
        }
    } else if (!wardrobePuzzleFirstHelp && !mirrorPuzzleFirstHelp) {
        wardrobePuzzleHelpElem.style.display = "none";
    }

    // Erhöhe die Sekunden
    seconds++;
    puzzleSeconds++;
}

// Funktion zum Verstecken des Jumbotrons
function hideJumbotron(event) {
    if (event.code === "Enter") {
        const playerNameInput = document.getElementById("player-name");
        const playerName = playerNameInput.value.trim();

        if (playerName.trim() === "") {
            alert("Bitte gib deinen Namen ein!");
            return;
        }

        const jumbotron = document.querySelector(".jumbotron");
        if (jumbotron) {
            jumbotron.style.display = "none";
            jumbotronVisible = false;

            // Entferne den Event-Listener, um Mehrfachausführungen zu verhindern
            document.removeEventListener("keydown", hideJumbotron);

            const videoBtnElem = document.getElementById("video-btn");
            videoBtnElem.style.display = "block";
        }

        // Starten der Hintergrundmusik, falls sie nicht bereits spielt
        if (!themeSoundIsPlaying) {
            playThemeSound();
            themeSoundIsPlaying = true;
        }

        playerNameInput.value = "";

        // Starte den Timer und aktualisiere die Zeit jede Sekunde
        updateTimeInterval = setInterval(updateTime, 1000);

        // Rufe die Funktion sofort auf, um den initialen Wert zu setzen
        updateTime();
    }
}

// Event-Listener hinzufügen, um das Jumbotron zu verstecken
document.addEventListener("keydown", hideJumbotron);

// Event-Listener für Tastatureingaben hinzufügen
document.addEventListener("keydown", function (event) {
    const player = document.getElementById("player");

    // Vorherige Spielerposition speichern
    let playerPositionBefore = {
        top: playerPosition.top,
        left: playerPosition.left,
    };

    // Spielerbewegung basierend auf der gedrückten Pfeiltaste
    switch (event.key) {
        case "ArrowUp":
            playerPosition.top -= 15;
            playStepSound();
            break;
        case "ArrowDown":
            playerPosition.top += 15;
            playStepSound();
            break;
        case "ArrowLeft":
            playerPosition.left -= 15;
            playStepSound();
            break;
        case "ArrowRight":
            playerPosition.left += 15;
            playStepSound();
            break;
    }

    // Spielerposition begrenzen
    if (playerPosition.top < 0) playerPosition.top = 0;
    if (playerPosition.top > 550) playerPosition.top = 550;
    if (playerPosition.left < 0) playerPosition.left = 0;
    if (playerPosition.left > 550) playerPosition.left = 550;

    // Kollision mit den Wänden und Objekten in den Räumen überprüfen
    checkMoveRoom1RightWall(playerPositionBefore, playerPosition);
    checkMoveRoom1BottomWall(playerPositionBefore, playerPosition);
    checkMoveRoom2RightWall(playerPositionBefore, playerPosition);
    checkMoveRoom2TopWall(playerPositionBefore, playerPosition);
    checkMoveRoom3LeftWall(playerPositionBefore, playerPosition);
    const isColliding = checkCollisionWithObjects(playerPosition, playerPositionBefore, actualRoom);

    // Spielerposition aktualisieren, wenn keine Kollision vorliegt
    player.style.top = playerPosition.top + "px";
    player.style.left = playerPosition.left + "px";

    // Kollisionen in den Räumen überprüfen
    checkRoom1MirrorPos(playerPosition, playerPositionBefore);
    if ((!mirrorPuzzle && mirrorPuzzleFirstHelp) || (!lightSwitch3Puzzle && lightSwitch3PuzzleFirstHelp)) {
        checkRoom1PcPos(playerPosition, playerPositionBefore);
    }

    checkRoom2DoorPos(playerPosition, playerPositionBefore);
    checkRoom2MorseCodePos(playerPosition, playerPositionBefore);
    if ((!morseCodePuzzle && morseCodePuzzleFirstHelp) || (!hexagonPuzzle && hexagonPuzzleFirstHelp)) {
        checkRoom2TablePos(playerPosition, playerPositionBefore);
    }

    checkRoom3LightSwitchPos(playerPosition, playerPositionBefore);
    checkRoom3WardrobePos(playerPosition, playerPositionBefore);
    checkRoom3ReaderPos(playerPosition, playerPositionBefore);
    if (!wardrobePuzzle && wardrobePuzzleFirstHelp) {
        checkRoom3TablePos(playerPosition, playerPositionBefore);
    }

    // Kollision mit dem Hexagon überprüfen
    checkHexagonPos(playerPosition);

    // Kollision mit Gegenständen überprüfen
    checkCollisionWithItems(playerPosition, playerPositionBefore);
});

// Funktion zum Deaktivieren des Hexagons nach Ablauf der Zeit
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
            setTimeout(() => clearHexagon(hexagon1Elem, 1), 16000);
        }
        if (actualRoom == 1 && !hexagon2Active && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 155 && playerPosition.top <= 180) {
            const hexagon2Elem = document.getElementById("hexagon2");
            hexagon2Elem.style.backgroundImage = "url('/images/general/hexagon-green.png')";
            hexagonSound.play();
            hexagon2Active = true;
            setTimeout(() => clearHexagon(hexagon2Elem, 2), 2000);
            if (hexagon1Active && hexagon2Active && hexagon3Active) {
                hexagonPuzzle = true;
                hexagonPuzzleFirstHelp = false;
                puzzleSeconds = 0;

                let door = document.querySelector(".door-3");
                doorSound.play();
                door.setAttribute("data-state", "open");

                if (lightRoom3State) {
                    const lightRoom3 = document.getElementById("lightRoom3");
                    lightRoom3.style.backgroundColor = "transparent";
                }
            }
        }
        if (actualRoom == 2 && !hexagon3Active && playerPosition.left >= 10 && playerPosition.left <= 25 && playerPosition.top >= 505 && playerPosition.top <= 530) {
            const hexagon3Elem = document.getElementById("hexagon3");
            hexagon3Elem.style.backgroundImage = "url('/images/general/hexagon-red.png')";
            hexagonSound.play();
            hexagon3Active = true;
            setTimeout(() => clearHexagon(hexagon3Elem, 3), 9500);
        }
    }
}
