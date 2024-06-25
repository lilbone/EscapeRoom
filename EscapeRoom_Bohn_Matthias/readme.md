# EscapeRoom Readme

## Beschreibung

Dieses Projekt besteht aus einem Escape Room, der auf einer Website dargestellt wird und von einem Raspberry Pi gehostet wird. Der Raspberry Pi fungiert als Webserver mit Apache 2 und betreibt zusätzlich einen MQTT-Server. Ein ESP8266 steuert mehrere Sensoren und Aktoren, darunter LEDs, Taster, einen LDR-Sensor, ein RFID-Chip Lesegerät und einen DHT-22 Sensor.

Die Website simuliert ein Haus mit drei Räumen und einem Flur. Die Spieler müssen verschiedene Rätsel lösen, die durch die Sensoren und Aktoren gesteuert werden, um von einem Raum zum nächsten zu gelangen. Die Kommunikation zwischen den Sensoren/Aktoren und der Website erfolgt über das MQTT-Protokoll.

## Funktionalitäten

*Raum 1:
   *Ein Spiegel, der beschlägt, wenn der DHT-22-Sensor angehaucht wird, um ein Passwort anzuzeigen. Mit diesem Passwort kann man den zweiten Raum öffnen.
*Raum 2:
   *Ein Morsecode-Rätsel, das durch eine leuchtende LED und einen Ton auf der Website angezeigt wird. Der entschlüsselte Code ermöglicht den Zugang zum nächsten Raum.
*Raum 3:
   *Es gibt drei Plattformen, die in der richtigen Reihenfolge betätigt werden müssen, um die Tür zu öffnen.
   *Vor dem 3. Raum muss man am ESP8266 den dritten Taster betätigen, um das Licht einzuschalten.
   *Ein Schrank enthält einen RFID-Chip, der sichtbar wird, wenn der LDR-Sensor beleuchtet wird.
   *Die letzte Tür kann nur mit dem RFID-Chip geöffnet werden, indem man ihn am ESP8266 einliest und danach die Tür öffnet.

## Verwendung

1. Installation: Befolge die Anweisungen in der install.md, um die benötigte Software zu installieren und den Server einzurichten.
2. Starten: Nach der Installation und Konfiguration starte den Apache2- und MQTT-Server.
3. Zugriff: Die Website ist unter der IP-Adresse des Raspberry Pi erreichbar. Öffne einen Webbrowser und gib die IP-Adresse ein, um das Spiel zu starten.

## Einstellungen

Die Website ist nach der Konfiguration des Apache2 servers und der Installation der benötigten Pakete unter `http://<IP-Adresse>` erreichbar.

## Abhängigkeiten

* MQTT-Tool: Mosquitto (MQTT-Broker)
* JavaScript-Bibliothek für MQTT: Paho MQTT JavaScript Client

## Hinweis

Diese Website wurde entwickelt, um auf einem Webserver (z.B. Apache) zu laufen. Stelle sicher, dass die Berechtigungen der Dateien korrekt gesetzt sind und dass die Skripte ausführbar sind. Zudem ist ein ESP8266 mit folgenden Sensoren und Aktoren erforderlich:

* LEDs
* Taster
* LDR-Sensor
* RFID-Chip Lesegerät
* DHT-22 Sensor

---

Falls weitere Fragen auftreten oder Unterstützung benötigt wird, stehe ich zur Verfügung. Viel Spaß mit dem EscapeRoom! 🎬🍿

## Copyright

© 2024 Matthias
