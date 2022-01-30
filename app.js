const express = require('express');
const db = require('./db');

const app = express();
const port = 3000;

app.get('/', async (req, res) => {
  const queryResult = await db.query('select * from recipe');
  res.send(queryResult.rows);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});