const http = Require('http');
const fs = Require('fs').promises;
const path = Require('path');

const dbPath = path.join(__dirname, 'users.json');

const server = http.createServer(async (req, res) => {
    if (req.method === 'GET' && req.url.startsWith('/api/v1/users')) {
        try {
            // Handle version 1 of the API using async/await
            const response = await handleAPIv1(req);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else if (req.method === 'GET' && req.url.startsWith('/api/v2/users')) {
        try {
            // Handle version 2 of the API using async/await
            const response = await handleAPIv2(req);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        } catch (error) {
            console.error('Error:', error);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// function to handle version 1 of the API with promises
async function handleAPIv1(req) {
    if (req.method === 'GET' && req.url === '/api/v1/users') {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const nameFilter = urlParams.get('name');
        const sortBy = urlParams.get('sort');

        try {
            const data = await fs.readFile(dbPath, 'utf8');
            let users = JSON.parse(data);

            if (nameFilter) {
                users = users.filter(user => user.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }

            if (sortBy === 'id') {
                users.sort((a, b) => a.id - b.id);
            } else if (sortBy === 'name') {
                users.sort((a, b) => a.name.localeCompare(b.name));
            }

            const page = parseInt(urlParams.get('page')) || 1;
            const limit = parseInt(urlParams.get('limit')) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const usersOnPage = users.slice(startIndex, endIndex);

            return usersOnPage;
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('Not Found');
    }
}

// function to handle version 2 of the API with promises
async function handleAPIv2(req) {
    if (req.method === 'GET' && req.url === '/api/v2/users') {
        const urlParams = new URLSearchParams(req.url.split('?')[1]);
        const nameFilter = urlParams.get('name');
        const sortBy = urlParams.get('sort');

        try {
            const data = await fs.readFile(dbPath, 'utf8');
            let users = JSON.parse(data);

            if (nameFilter) {
                users = users.filter(user => user.name.toLowerCase().includes(nameFilter.toLowerCase()));
            }

            if (sortBy === 'id') {
                users.sort((a, b) => a.id - b.id);
            } else if (sortBy === 'name') {
                users.sort((a, b) => a.name.localeCompare(b.name));
            }

            const page = parseInt(urlParams.get('page')) || 1;
            const limit = parseInt(urlParams.get('limit')) || 10;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const usersOnPage = users.slice(startIndex, endIndex);

            return usersOnPage;
        } catch (error) {
            throw error;
        }
    } else {
        throw new Error('Not Found');
    }
}

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server running on <http://localhost:3000/>');
});
