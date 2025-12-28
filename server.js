const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8000;

const server = http.createServer((req, res) => {
    let filePath = req.url;
    
    if (filePath === '/') {
        filePath = '/index.html';
    }
    
    const fullPath = path.join(process.cwd(), filePath);
    
    fs.readFile(fullPath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
            return;
        }
        
        const ext = path.extname(fullPath);
        let contentType = 'text/html';
        
        if (ext === '.css') {
            contentType = 'text/css';
        } else if (ext === '.js') {
            contentType = 'application/javascript';
        }
        
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});