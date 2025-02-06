const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const port = process.env.PORT || 3000; // Use PORT provided by Render

http.createServer((req, res) => {
    if (req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(`
        <html>
        <body>
            <h2>Enter Your Details</h2>
            <form method="POST">
                Name: <input type="text" name="name"><br><br>
                Roll No.: <input type="text" name="rollno"><br><br>
                <button type="submit">Submit</button>
            </form>
        </body>
        </html>`);
        res.end();
    } else if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {
            const parsedData = querystring.parse(body);
            const formattedData = `Name: ${parsedData.name}, Roll No.: ${parsedData.rollno}\n`;

            console.log("Received Data:", formattedData);
            fs.appendFileSync('valuesaver.txt', formattedData);

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end("Attendance Marked Successfully!");
        });
    }
}).listen(port, '0.0.0.0', () => console.log(`Server running on http://0.0.0.0:${port}`));
