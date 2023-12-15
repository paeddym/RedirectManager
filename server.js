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

const authenticate = (req, res, next) => {
  //TODO
  next();
};


app.get('/entries', authenticate, (req, res) => {

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


app.get('/:slug', (req, res) => {
  const { slug } = req.params;

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

// DELETE /entry/:slug
app.delete('/entry/:slug', authenticate, (req, res) => {
  const { slug } = req.params;

  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);
      if (entries[slug]) {
        delete entries[slug];

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


app.post('/entry', authenticate, (req, res) => {
  const { slug, url } = req.body;

  fs.readFile(dataFilePath, 'utf8')
    .then((data) => {
      const entries = JSON.parse(data);

      const newSlug = slug || generateRandomSlug();

      entries[newSlug] = url;

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

function generateRandomSlug() {
  return Math.random().toString(36).substring(2, 8);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
