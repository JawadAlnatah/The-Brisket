const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'brisketImages');
const targetDir = path.join(__dirname, 'public', 'brisket-sequence');

// Ensure target dir exists
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

fs.readdir(sourceDir, (err, files) => {
    if (err) {
        console.error('Could not list the directory.', err);
        process.exit(1);
    }

    files.forEach((file, index) => {
        // Only process jpg/png
        if (!file.match(/\.(jpg|jpeg|png)$/i)) return;

        // Construct new name frame_000.jpg
        const ext = path.extname(file);
        const newName = `frame_${index.toString().padStart(3, '0')}${ext}`;

        const oldPath = path.join(sourceDir, file);
        const newPath = path.join(targetDir, newName);

        fs.copyFile(oldPath, newPath, (err) => {
            if (err) throw err;
            console.log(`${file} -> ${newName}`);
        });
    });
});
