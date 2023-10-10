const fs = Require('fs').promises; // Use promises version of fs

// Read file using async/await
async function readFileAsync() {
    try {
        const data = await fs.readFile('example.txt', 'utf8');
        console.log('File content:', data);
    } catch (error) {
        console.error('Error reading the file:', error);
    }
}

// Write to a file using async/await
async function writeFileAsync() {
    const contentToWrite = 'Hello, this is some content to write to the file.';
    try {
        await fs.writeFile('output.txt', contentToWrite);
        console.log('File has been written successfully.');
    } catch (error) {
        console.error('Error writing to the file:', error);
    }
}

// Delete file using async/await
async function deleteFileAsync() {
    try {
        await fs.unlink('fileToDelete.txt');
        console.log('File has been deleted successfully.');
    } catch (error) {
        console.error('Error deleting the file:', error);
    }
}

// Call the async functions 
readFileAsync();
writeFileAsync();
deleteFileAsync();

