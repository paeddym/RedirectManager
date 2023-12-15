/* const express = require("express");
const app = express();
const fs = require("fs");
const port = 8080;
const filename = __dirname + "/redirects.json";

app.get();

app.get();

app.delete();

app.post(); */

const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'redirects.json');

// Middleware für die Authentifizierung
const authenticate = (req, res, next) => {
  // Hier könnten Sie Ihre Authentifizierungslogik einfügen
  // Zum Beispiel: Überprüfen Sie, ob der Benutzer angemeldet ist
  // und ob er die erforderlichen Berechtigungen hat.
  // Hier ist es jedoch einfachheitshalber ausgelassen.
  next();
};

// GET /:slug
app.get('/:slug', (req, res) => {
  const { slug } = req.params;

  // Hier könnten Sie zusätzliche Validierungen vornehmen,
  // um sicherzustellen, dass die Anfrage gültig ist.

  // Lese die Daten aus der Datei
  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);
      const targetUrl = entries[slug];

      if (targetUrl) {
        res.redirect(targetUrl);
      } else {
        res.status(404).send('Slug not found');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// GET /entries
app.get('/entries', authenticate, (req, res) => {
  // Hier könnten Sie zusätzliche Logik hinzufügen,
  // um sicherzustellen, dass der Benutzer die Berechtigungen hat,
  // um die Einträge abzurufen.

  // Lese die Daten aus der Datei
  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);
      res.json(entries);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// DELETE /entry/:slug
app.delete('/entry/:slug', authenticate, (req, res) => {
  const { slug } = req.params;

  // Hier könnten Sie zusätzliche Logik hinzufügen,
  // um sicherzustellen, dass der Benutzer die Berechtigungen hat,
  // um den Eintrag zu löschen.

  // Lese die Daten aus der Datei
  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);
      if (entries[slug]) {
        delete entries[slug];
        // Schreibe die aktualisierten Daten zurück in die Datei
        return fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2), 'utf8');
      } else {
        res.status(404).send('Slug not found');
      }
    })
    .then(() => {
      res.send('Entry deleted successfully');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// POST /entry
app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;

  // Hier könnten Sie zusätzliche Validierungen vornehmen,
  // um sicherzustellen, dass die Anfrage gültig ist.

  // Lese die Daten aus der Datei
  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);

      // Generiere eine zufällige Slug, wenn keine mitgegeben wurde
      const newSlug = slug || generateRandomSlug();

      // Speichere den Eintrag in den Daten
      entries[newSlug] = url;

      // Schreibe die aktualisierten Daten zurück in die Datei
      return fs.writeFile(dataFilePath, JSON.stringify(entries, null, 2), 'utf8');
    })
    .then(() => {
      res.send('Entry added successfully');
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

// Hilfsfunktion zur Generierung einer zufälligen Slug
function generateRandomSlug() {
  return Math.random().toString(36).substring(2, 8);
}

// Starte den Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
