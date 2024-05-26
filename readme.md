# Watch Pulse WebApp Readme

## Beschreibung

Die Watch Pulse WebApp ist eine Anwendung, die es ermöglicht, Filme und Serien zu suchen, Informationen dazu anzuzeigen und sie zu einer persönlichen Watchlist hinzuzufügen. Die WebApp verwendet die OMDB-API, um detaillierte Informationen zu den gesuchten Filmen und Serien zu erhalten.

## Funktionalitäten

1. **Suche nach Filmen/Serien:** Die WebApp ermöglicht es dem Benutzer, nach Filmen oder Serien zu suchen, indem er den Namen oder die IMBd-Nummer  unter "Search your Watch" eingibt.

2. **Anzeige von Informationen:** Nach der Suche werden detaillierte Informationen zum ausgewählten Film/Serie angezeigt, einschließlich Poster, Titel, Jahr.

3. **Hinzufügen zu Watchlist:** Der Benutzer kann den ausgewählten Film/Serie zu seiner Watchlist mit Klick auf "Add to Watches" hinzufügen und dabei eine persönliche Bewertung abgeben.

4. **Anzeige der Watchlist:** Die Watchlist wird auf der Seite "My Watches" angezeigt, wo der Benutzer seine hinzugefügten Filme und Serien verwalten kann.

## Verwendung

1. **Suche nach Filmen/Serien:**
   - Gehe zur Seite "Search your Watch".
   - Wähle den Typ (Movie, Series) im Dropdown-Menü "Type" aus.
   - Gib den Namen oder die IMBd-Nummer des Films/Serie in das Feld "Name/IMBd-Nr." ein.
   - Das Ergebnis wird unter dem Suchfeld angezeigt, einschließlich Poster, Titel, Jahr und einem Formular zum Hinzufügen zur Watchlist.

2. **Hinzufügen zu Watchlist:**
   - Nachdem die Informationen zum Film/Serie angezeigt wurden, kannst du eine persönliche Bewertung auf einer Skala von 0 bis 10 auswählen.
   - Klicke auf den Button "Add to Watches", um den Film/Serie zur Watchlist hinzuzufügen.

3. **Anzeige der Watchlist:**
   - Gehe zur Seite "My Watches".
   - Dort findest du eine Liste der von dir hinzugefügten Filme und Serien mit ihren Details.
   - Mit der Filter Funktion kannst du alle deine Watches nach Genre Filtern und anzeigen lassen.

## Einstellungen

Die WebApp erfordert keine spezifischen Einstellungen. Beachte jedoch, dass die OMDB-API einen API-Schlüssel benötigt, der in der `js/main.js`-Datei festgelegt ist. Stelle sicher, dass du einen gültigen API-Schlüssel von OMDB besitzt und ersetze ihn in der Datei, falls erforderlich.

Die WebApp ist nach der Konfiguration des Apache2 servers und der Installation der benötigten Pakete unter `IP-Adresse/Watchpulse.cgi` erreichbar.

## Abhängigkeiten

Die WebApp benötigt das Tool `jq` für die JSON-Verarbeitung. Stelle sicher, dass `jq` auf deinem System installiert ist, um die volle Funktionalität zu gewährleisten.

## Log-Datei (`log.txt`) Funktionalität

Die `log.txt`-Datei wird für das Logging von Informationen verwendet. Hier sind einige Hinweise zur Nutzung:

- **addWatch Request:** Wenn `HTTP_ADDWATCH` auf "true" gesetzt ist, wird die Anfrage zum Hinzufügen eines Films/Serie zur Watchlist in die `log.txt` geschrieben.
  
- **Query-Parameter Logging:** Die empfangenen Query-Parameter werden in die `log.txt` geschrieben.

- **Timestamp:** Jeder Log-Eintrag enthält einen Zeitstempel.

## Anpassungen

Du kannst das Erscheinungsbild der WebApp anpassen, indem du die CSS-Dateien in den `<link>`-Tags der `index.cgi`-Datei bearbeitest. Ändere auch den Seitentitel und die Navigationselemente nach Bedarf.

## Hinweis

Diese Anwendung wurde entwickelt, um auf einem Server mit einem CGI-fähigen Webserver (z.B., Apache) zu laufen. Stelle sicher, dass die Berechtigungen der Dateien korrekt gesetzt sind, und dass die Skripte ausführbar sind.

---

Falls weitere Fragen auftreten oder Unterstützung benötigt wird, stehe ich zur Verfügung. Viel Spaß mit der Watch Pulse WebApp! 🎬🍿
