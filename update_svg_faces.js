
import fs from 'fs';
import path from 'path';

const directory = 'c:/Users/Diomedes Fernandez/.gemini/antigravity/scratch/world-builder/src/assets/humans';
const files = fs.readdirSync(directory).filter(f => f.startsWith('WBM_human_') && f.endsWith('.svg'));

console.log(`Found ${files.length} SVG files.`);

files.forEach(file => {
    const filePath = path.join(directory, file);
    let content = fs.readFileSync(filePath, 'utf8');

    if (content.includes('id="face-tint"')) {
        console.log(`Skipping ${file} (already updated)`);
        return;
    }

    const circle = '<circle id="face-tint" cx="50%" cy="12%" r="30" fill="currentColor" style="mix-blend-mode: multiply; opacity: 0.6;" />';

    content = content.replace(/<\/svg>/i, `${circle}</svg>`);

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${file}`);
});
