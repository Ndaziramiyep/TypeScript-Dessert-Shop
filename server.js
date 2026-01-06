const http = require('http'); // Import HTTP module
const fs = require('fs');   // Import File System module
const path = require('path');  // Import Path module

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    if (filePath === './') { // Default to index.html
        filePath = './index.html';  // Default to index.html
    }

    // Handle spaces in file paths
    filePath = decodeURIComponent(filePath); // 

    const extname = String(path.extname(filePath)).toLowerCase(); // Get file extension
    const mimeTypes = {  // MIME types mapping
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code + ' ..\n'); //    500 Internal Server Error
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = process.env.PORT || 5000; // Use environment port or default to 5000
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`); // Log server start
});