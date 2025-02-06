require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const querystring = require('querystring');

const app = express();
const port = process.env.PORT || 3000;
let id = 1;

// Serve static files from the 'public' folder

// app.get('/', (req, res) => {
//   // Serve the HTML file from the 'public' directory
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });
app.get('/', (req, res) => {
res.writeHead(200, {'Content-Type': 'text/html'});
res.write(`<html><body>
  <h2>Enter Your Details</h2>
  <form method="POST">
  Name: <input type="text" name="name"><br><br>
  Rollno.: <input type="text" name="rollno"><br><br>
  <button type="submit">Submit</button>
  </form></body></html>`)
});

app.post('/', (req, res) => {
  let body = '';

  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const parsedData = querystring.parse(body);

      if (!parsedData.name || !parsedData.rollno) {
        throw new Error('Missing name or roll number.');
      }

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toLocaleTimeString();

      const formattedData = `Date: ${dateStr} Time: ${timeStr}\nId: ${id}\nName: ${decodeURIComponent(parsedData.name)}\nRoll No.: ${decodeURIComponent(parsedData.rollno)}\n\n`;

      id++;
      fs.appendFileSync('valuesaver.txt', formattedData);

      res.status(200).send("Attendance Marked Successfully!");

    } catch (error) {
      res.status(400).send(`Error: ${error.message}`);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
