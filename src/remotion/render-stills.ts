import { bundle } from '@remotion/bundler';
import { getCompositions, renderStill } from '@remotion/renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);

const start = async () => {
    console.log('Bundling...');
    const entry = './src/remotion/index.ts';
    const bundleLocation = await bundle({
        entryPoint: path.resolve(process.cwd(), entry),
    });

    const comps = await getCompositions(bundleLocation);
    const composition = comps.find((c) => c.id === 'FullSequence');

    if (!composition) {
        throw new Error('Composition not found');
    }

    const outDir = path.resolve(process.cwd(), 'out', 'stills');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    console.log('Rendering stills (1 per second)...');
    const durationInSeconds = Math.floor(composition.durationInFrames / composition.fps);

    for (let i = 0; i < durationInSeconds; i++) {
        const frame = i * composition.fps;
        await renderStill({
            composition,
            serveUrl: bundleLocation,
            output: path.join(outDir, `frame-${i}.png`),
            frame,
            inputProps: {},
        });
        console.log(`Rendered second ${i}`);
    }

    console.log('Stills saved to', outDir);
};

start();
