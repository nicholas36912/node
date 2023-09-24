const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const dbPath = path.join(__dirname, 'users.json');

const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/api/v1/users')) {
        // Handle version 1 of the API
        handleAPIv1(req, res);
    } else if (req.method === 'GET' && req.url.startsWith('/api/v2/users')) {
        // Handle version 2 of the API
        handleAPIv2(req, res);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Define a function to handle version 1 of the API
function handleAPIv1(req, res) {
    if (req.method === 'GET' && req.url === '/api/v1/users') {
        // Handle API filtering, sorting, and pagination here
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const nameFilter = urlParams.get('name');
        const sortBy = urlParams.get('sort');

        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error('Error reading file:', err);
                return;
            }

            let users = JSON.parse(data);

            if (nameFilter) {
                users = users.filter(user => user.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }

            if (sortBy === 'id') {
                users.sort((a, b) => a.id - b.id);
            } else if (sortBy === 'name') {
                users.sort((a, b) => a.name.localeCompare(b.name));
            }

            // Handle pagination
            const page = parseInt(urlParams.get('page')) || 1;
            const limit = parseInt(urlParams.get('limit')) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const usersOnPage = users.slice(startIndex, endIndex);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(usersOnPage));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

// Define a function to handle version 2 of the API (You can implement it similarly)
// Define a function to handle version 2 of the API
function handleAPIv2(req, res) {
    if (req.method === 'GET' && req.url === '/api/v2/users') {
        // Handle API filtering, sorting, and pagination for version 2 here
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const nameFilter = urlParams.get('name');
        const sortBy = urlParams.get('sort');

        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                console.error('Error reading file:', err);
                return;
            }

            let users = JSON.parse(data);

            if (nameFilter) {
                users = users.filter(user => user.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }

            if (sortBy === 'id') {
                users.sort((a, b) => a.id - b.id);
            } else if (sortBy === 'name') {
                users.sort((a, b) => a.name.localeCompare(b.name));
            }

            // Handle pagination for version 2
            const page = parseInt(urlParams.get('page')) || 1;
            const limit = parseInt(urlParams.get('limit')) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const usersOnPage = users.slice(startIndex, endIndex);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(usersOnPage));
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}
// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on <http://localhost:3000/>');
});

