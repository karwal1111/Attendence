const http = require('http');
const fs = require('fs');
const port = process.env.PORT || 3000;
const querystring = require('querystring');

http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.write(`
      <html>
      <body>
        <h2>Enter Your Details</h2>
        <form method="POST">
          Name: <input type="text" name="name"><br><br>
          Roll No: <input type="text" name="rollno"><br><br>
          <button type="submit">Submit</button>
        </form>
      </body>
      </html>
    `);
    res.end();
  } 
  else if (req.method === 'POST') {
    let body = '';

    // Collect data
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      // Parse the URL-encoded data
      const parsedData = querystring.parse(body);

      // Check if the data is valid
      if (!parsedData.name || !parsedData.rollno) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Error: Missing name or roll number.');
        return;
      }

      // Format data for logging
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
      const timeStr = now.toLocaleTimeString(); // HH:MM:SS
      const formattedData = `Date: ${dateStr} Time: ${timeStr}\nName: ${parsedData.name}\nRoll No: ${parsedData.rollno}\n\n`;

      // Append data to file
      fs.appendFileSync('valuesaver.txt', formattedData);

      // Respond to client
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Attendance Marked Successfully!');

      // Log received data
      console.log("Received Data:", parsedData);
    });
  }
}).listen(port, () => console.log(`Server running on http://localhost:${port}`));
