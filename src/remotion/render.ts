import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);

const start = async () => {
    console.log('Finding composition...');
    const entry = './src/remotion/index.ts';

    // Bundle the project
    const bundleLocation = await bundle({
        entryPoint: path.resolve(process.cwd(), entry),
        // If you have a Webpack override, pass it here
    });

    // Fetch compositions
    const comps = await getCompositions(bundleLocation, {
        inputProps: {}, // Optional: Pass default input props
    });

    // Select 'FullSequence'
    const composition = comps.find((c) => c.id === 'FullSequence');

    if (!composition) {
        throw new Error('No composition called FullSequence found!');
    }

    console.log('Rendering video...');
    const outputLocation = path.resolve(process.cwd(), 'out', 'video.mp4');

    await renderMedia({
        composition,
        serveUrl: bundleLocation,
        codec: 'h264',
        outputLocation,
        inputProps: {}, // You can read from a JSON file here if needed
        onProgress: ({ progress }) => {
            console.log(`Rendering is ${Math.round(progress * 100)}% complete...`);
        },
    });

    console.log('Render done!', outputLocation);
};

start();
