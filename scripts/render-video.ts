
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import { bundle } from '@remotion/bundler';
import fs from 'fs';

const start = async () => {
    // 1. Bundle the code
    console.log('Bundling...');
    const bundled = await bundle({
        entryPoint: path.resolve('./src/remotion/index.ts'),
        // If you have specific Webpack config, you might need to adjust
    });

    // 2. Fetch the composition to render
    console.log('Fetching composition...');
    const composition = await selectComposition({
        serveUrl: bundled,
        id: 'WorldBuilderPreview', // Matches Root.tsx
    });

    // 3. Render the video
    console.log('Rendering video...');
    const outputLocation = path.resolve('out/video.mp4');

    // Ensure 'out' directory exists
    if (!fs.existsSync(path.dirname(outputLocation))) {
        fs.mkdirSync(path.dirname(outputLocation));
    }

    await renderMedia({
        composition,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation,
        inputProps: {
            // Read from data/vector-data.json if exists, else use default mock in Root
            // For this step, we'll try to read the file if it was saved by the UI
        }
    });

    console.log('Video rendered to:', outputLocation);
};

start();
