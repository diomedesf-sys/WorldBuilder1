
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { SequenceComposition } from '../remotion/SequenceComposition';
// In a real scenario, we would need to compile the composition separately or import it if using ts-node/tsx.
// Since we are inside the project, we'll assume we can bundle the entry point.

const entryPoint = path.join(process.cwd(), 'src/remotion/index.ts');
const outDir = path.join(process.cwd(), 'out');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
}

const renderVideo = async () => {
    console.log('Bundling...');
    const bundled = await bundle(path.join(process.cwd(), 'src/remotion/index.ts'), () => undefined, {
        webpackOverride: (config) => config,
    });

    console.log('Rendering video...');
    await renderMedia({
        composition: {
            id: 'WorldBuilderPreview',
            width: 1920,
            height: 1080,
            fps: 30,
            durationInFrames: 300,
            props: {
                row: undefined
            }
        } as any,
        serveUrl: bundled,
        codec: 'h264',
        outputLocation: path.join(outDir, 'video.mp4'),
        inputProps: {}, // props would go here
    });
    console.log('Video rendered to out/video.mp4');
};

const renderImages = async () => {
    console.log('Bundling...');
    const bundled = await bundle(path.join(process.cwd(), 'src/remotion/index.ts'), () => undefined, {
        webpackOverride: (config) => config,
    });

    console.log('Rendering stills...');
    // Render a few frames as example
    const frames = [0, 30, 60, 90];
    for (const frame of frames) {
        await renderStill({
            composition: {
                id: 'WorldBuilderPreview',
                width: 1920,
                height: 1080,
                fps: 30,
                durationInFrames: 300,
                props: {
                    rows: [] // Empty array for now, or load mock data
                }
            } as any,
            serveUrl: bundled,
            frame,
            output: path.join(outDir, `still-${frame}.png`),
        });
    }
    console.log('Stills rendered to out/');
};


const mode = process.argv[2];

if (mode === 'video') {
    renderVideo();
} else if (mode === 'stills') {
    renderImages();
} else {
    console.log('Usage: npx tsx src/scripts/render.ts [video|stills]');
}
