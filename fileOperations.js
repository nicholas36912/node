const fs = require('fs');

// Read a file
fs.readFile('example.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }
    console.log('File content:', data);
});

// Write content to a file
const contentToWrite = 'Hello, this is some content to write to the file.';
fs.writeFile('output.txt', contentToWrite, (err) => {
    if (err) {
        console.error('Error writing to the file:', err);
        return;
    }
    console.log('File has been written successfully.');
});

// Delete a file
fs.unlink('fileToDelete.txt', (err) => {
    if (err) {
        console.error('Error deleting the file:', err);
        return;
    }
    console.log('File has been deleted successfully.');
});


