import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js';

const targetPath = 'C:\\Users\\Diomedes Fernandez\\Desktop\\300L Projecto\\My docs\\Historia de la isla en 300 lineas final (2).pdf';

let dataBuffer = fs.readFileSync(targetPath);

pdf(dataBuffer).then(function (data) {
    fs.writeFileSync('extracted_poem.txt', data.text);
    console.log("Extracted " + data.numpages + " pages.");
}).catch(err => {
    console.error("Error reading PDF:", err);
});
