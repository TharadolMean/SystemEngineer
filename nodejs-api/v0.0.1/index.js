const express = require('express');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Node.js API v0.0.1' });
});

app.listen(port, () => {
  console.log(`Node.js API v0.0.1 is listening on port ${port}`);
});
