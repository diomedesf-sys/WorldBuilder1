
# WorldBuilder

**WorldBuilder** is a "Concentric" design system tool for creating abstract, geometric narrative animations based on poetry. It uses React and Remotion to generate high-quality video content from structured data.

## Getting Started

### Prerequisites
- Node.js (v18+)
- NPM

### Installation
```bash
npm install
```

### Running the Editor
To start the local development environment:
```bash
npm run dev
```
This will open the WorldBuilder interface in your browser (usually at `http://localhost:5173`).

## Workflow

1.  **Poem Source**: Select a stanza from the loaded poem (e.g., Line 1, 34, 100).
2.  **Storyboard Table**: Define the intent and visual metaphor for each beat.
3.  **Vector Table**: Fine-tune the position, color, and motion of glyphs.
4.  **Preview**: Watch the generated animation.

## adding New Paragraphs
To add new mock data or real poem segments:
1.  Create a new file in `src/data/` (e.g., `stanza[ID].ts`).
2.  Define `[ID]_STORYBOARD` and `[ID]_VECTOR` arrays following the `StoryboardRow` and `VectorRow` interfaces.
3.  Update `src/data/loader.ts` to import your new data and add a case to the `loadStanzaData` switch statement.

## Exporting Video

To render the final MP4 video, run the following command in your terminal:

```bash
npm run render
```

The output file will be saved to `out/video.mp4`.

## Exporting Stills

To export a single high-quality PNG still:

```bash
npm run render-stills
```

Output saved to `out/still.png`.

## Known Limitations
-   **Audio Sync**: Narration is currently a placeholder URL. Replace `NARRATION_URL` in `src/remotion/SequenceComposition.tsx` with a local file import for final production.
-   **Export**: Browser-side export of stills is simulated. Use the terminal commands for actual high-res output.
-   **Performance**: Complex particle systems may drop frames in the browser preview; the final render will be smooth.
