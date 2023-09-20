const http = require('http');
const fs = require('fs');
const path = require('path');
const { parse } = require('querystring');

const dbPath = path.join(__dirname, 'users.json'); // Updated to 'users.json'

// Create an HTTP server
const server = http.createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/users') {
        // Read user data 
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(data);
        });
    } else if (req.method === 'POST' && req.url === '/api/users') {
        // Create new user
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newUser = JSON.parse(body);
            fs.readFile(dbPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                const users = JSON.parse(data);
                newUser.id = users.length + 1;
                users.push(newUser);
                fs.writeFile(dbPath, JSON.stringify(users), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(newUser));
                });
            });
        });
    } else if (req.method === 'GET' && req.url.startsWith('/api/users/')) {
        // Read user by ID
        const userId = parseInt(req.url.split('/').pop());
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            const users = JSON.parse(data);
            const user = users.find((u) => u.id === userId);
            if (user) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(user));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User Not Found');
            }
        });
    } else if (req.method === 'PUT' && req.url.startsWith('/api/users/')) {
        // Update user by ID
        const userId = parseInt(req.url.split('/').pop());
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const updatedUser = JSON.parse(body);
            fs.readFile(dbPath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                    return;
                }
                const users = JSON.parse(data);
                const userIndex = users.findIndex((u) => u.id === userId);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...updatedUser };
                    fs.writeFile(dbPath, JSON.stringify(users), (err) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'text/plain' });
                            res.end('Internal Server Error');
                            return;
                        }
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(users[userIndex]));
                    });
                } else {
                    res.writeHead(404, { 'Content-Type': 'text/plain' });
                    res.end('User Not Found');
                }
            });
        });
    } else if (req.method === 'DELETE' && req.url.startsWith('/api/users/')) {
        // Delete a user by ID
        const userId = parseInt(req.url.split('/').pop());
        fs.readFile(dbPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            const users = JSON.parse(data);
            const userIndex = users.findIndex((u) => u.id === userId);
            if (userIndex !== -1) {
                const deletedUser = users.splice(userIndex, 1)[0];
                fs.writeFile(dbPath, JSON.stringify(users), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(deletedUser));
                });
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('User Not Found');
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on <http://localhost:3000/>');
});

