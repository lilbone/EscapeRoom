# EscapeRoom Install

## Installation von git unter Linux

Führe die folgenden Befehle aus, um `git` auf einem Linux-System zu installieren:

```bash
sudo apt update
sudo apt install git
```
## MQTT auf dem Raspberry Pi installieren

Installiere das MQTT-Paket (Mosquitto) auf dem Raspberry Pi:
```bash
sudo apt update
sudo apt install mosquitto mosquitto-clients
```

Starte den Mosquitto-Dienst und stelle sicher, dass er beim Systemstart aktiviert ist:

```bash
sudo systemctl start mosquitto
sudo systemctl enable mosquitto
```

## Apache2-Konfiguration

Installation von Apache2

```bash
sudo apt update
sudo apt install apache2 
```

Füge die folgende Konfiguration zur `/etc/apache2/sites-available/000-default.conf` hinzu, um den Zugriff auf das Verzeichnis der CGI-Skripte zu ermöglichen:

```apache
<VirtualHost *:80>
    # ...

    DocumentRoot /home/mqtt/EscapeRoom

    # ...

    <Directory "/home/mqtt/">
        AllowOverride None
        Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
        Require all granted
    </Directory>

    ProxyPassMatch          "/ws$"  ws://127.0.0.1:9001

</VirtualHost>
```

Nach den Änderungen muss der Apache Server neu gestartet werden:

```bash
service apache2 restart
```

## Dateien von Git herunterladen

Lade die Watch-Pulse Dateien in deinen Projekt-Ordner herunter

```bash
cd /home/mqtt/
sudo git clone https://github.com/lilbone/EscapeRoom.git
```

Anschließend musst du noch den Benutzer anpassen:

```bash
sudo chmod -R +x /home/mqtt/EscapeRoom
```
## Arduino-Bibliotheken installieren

Um den Sketch escapeRoomSketch.ino auf deinem ESP8266 auszuführen, musst du die folgenden Arduino-Bibliotheken installieren:

* DHT Sensor Library von Adafruit:
  * Suche in der Bibliotheksverwaltung nach "DHT sensor library" und installiere sie.
* ESP8266WiFi:
  * Diese Bibliothek ist normalerweise mit der Installation des ESP8266-Pakets in der Arduino-IDE enthalten.
* PubSubClient:
  * Suche in der Bibliotheksverwaltung nach "PubSubClient" und installiere sie.
* MFRC522:
  * Suche in der Bibliotheksverwaltung nach "MFRC522" und installiere sie.
* Streaming:
  * Suche in der Bibliotheksverwaltung nach "Streaming" und installiere sie.

## ESP8266 vorbereiten

<img src="./EscapeRoom_esp.jpg" alt="ESP8266 Verkabelung" height="200px">

* Taster / LED / Senor-Erweiterung aufstecken
* DHT-22 mit Sensor-Schnittstelle verbinden
* RFID Chip-Reader wie folgt verbinden:
  * Orange 3,3v   -> 3,3v
  * Gelb RST      -> 3 RXD
  * Schwarz SDA   -> 5
  * Grün GND      -> GND
  * Weiß SCK      -> 14
  * Lila MISO     -> 12
  * Grau MOSI     -> 13

## Copyright

© 2024 Matthias
