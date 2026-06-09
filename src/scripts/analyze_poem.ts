import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.VITE_GEMINI_API_KEY });

const lexicon = `
## Dominican Lexicon overrides:
- Jack Veneno: Hero, Conflict, Force (wrestler, not a literal villain).
- Engendro del Mal: Jack Veneno's wrestling rival/villain.
- Pololo, Cuquín, Boruga, Freddy: Comedians, Routine, Laughter.
- Sorpresitas Popeye: A children's snack/toy. Childhood, Innocence.
- Día de San Andrés: Holiday tradition of throwing eggs at people. Chaos, Play.
- Frigor (Paletas de Frigor): Ice cream brand. Youth, Sweetness.
- Super 8: A thrilling roller coaster. Excitement, Movement, Cycles.
- Quisqueya Park: The amusement park housing the Super 8. Danger, Thrill.
- El Chavo / Tres Patines: Beloved TV comedies. Routine, Nostalgia.
- Mundo sobre Ruedas: A roller-skating rink. Circular Motion, The Cycle, Youth.
- Liborio: A messianic faith healer/revolutionary martyr. Spirituality, Rebellion.
- YaYá: The supreme Taino creator spirit. Genesis, The Cosmic, The Source.
- Juracán: The Taino god of chaos/hurricanes. Elemental Fear, Nature's Wrath.
- Duarte: Dominican founding father. The Hero, Vision, Sacrifice.
- Trujillo: Brutal dictator 1930-1961. The Shadow, Terror, Absolute Power.
- Caamaño: Revolutionary leader of the 1965 civil war. Resistance, Hope.
- Balaguer: Long-ruling Dominican president. Persistence, Inescapable Cycle.
`;

const schemaParams = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            globalLineIndex: {
                type: Type.INTEGER,
                description: "The exact line number from the input (1-300)"
            },
            tension: {
                type: Type.NUMBER,
                description: "0.0 (fully relaxed, peaceful) to 1.0 (fully rigid, aggressive, desperate)"
            },
            energy: {
                type: Type.NUMBER,
                description: "0.0 (totally still, slow, quiet) to 1.0 (vibrating, chaotic, explosive)"
            },
            archetype: {
                type: Type.STRING,
                description: "Exactly one of: Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter"
            },
            petroglyph: {
                type: Type.STRING,
                description: "Exactly one of: El Humano, La Multitud, El Ser, La Sombra, La Ola, El Sol, La Tierra, El Aliento, La Nave, La Estructura, La Herramienta, La Red, El Cáncer, La Explosión, El Ciclo"
            }
        },
        required: ["globalLineIndex", "tension", "energy", "archetype", "petroglyph"]
    }
};

async function run() {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const inputPath = path.join(dataDir, 'master-score.json');
    const outputPath = path.join(dataDir, 'master-score-analyzed.json');

    console.log("Loading 300 beats...");
    const beats = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
    console.log(`Loaded ${beats.length} beats.`);

    // Build the full poem text as a single numbered list
    const fullPoemText = beats
        .map((b: any) => `${b.globalLineIndex}: [${b.era}, Poem ${b.poemIndex}, Stanza ${b.stanzaIndex}] ${b.text}`)
        .join('\n');

    const prompt = `
You are an expert in procedural animation, Latin American history, depth psychology, and poetry analysis.

We are building "Historia de la Isla" — a generative video art piece for a 300-line epic poem about the history of the Dominican Republic.

Your task: Analyze ALL 300 lines below and return a JSON array with exactly 300 objects, one per line, maintaining the arc of the full poem as you go.

## Context:
- Era "Pasado" (Lines 1-99): From Taino creation myth through Spanish conquest and slavery to Dominican independence.
- Era "Presente" (Lines 100-198): From Liborio through Trujillo, the 1965 civil war, the 80s nostalgia, modern cynicism, and the "cancer" of mega-modern society.
- Era "Futuro" (Lines 199-300): A return to nature, community, new Cacicazgos, and hope.

## Dominican Cultural Lexicon:
${lexicon}

## Petroglyph Dictionary — choose EXACTLY ONE per line:
- El Humano: A single person, individual struggle or presence.
- La Multitud: A crowd, collective force, community.
- El Ser: YaYá, God, the cosmic/spiritual.
- La Sombra: The Dictator, oppressor, invisible threat.
- La Ola: Water, ocean, waves, flow, cleansing.
- El Sol: Sun, fire, heat, light, energy source.
- La Tierra: Earth, land, roots, nature, island itself.
- El Aliento: Breath, wind, air, spirit, the invisible force.
- La Nave: A ship, vehicle, journey, arrival/departure.
- La Estructura: A building, institution, system, cage, home.
- La Herramienta: A tool, weapon, object of labor or violence.
- La Red: A network, web, trap, connection, internet.
- El Cáncer: Cancerous growth, spreading corruption, metastasis.
- La Explosión: A burst, detonation, breaking point, chaos.
- El Ciclo: A circle, cycle, repetition, wheel, return.

## Archetype Color System — choose EXACTLY ONE per line:
- Mars (The Force): Violence, creation, fighting, war, beginnings. Color: Crimson/Orange.
- Sun (The Light): The hero, quests, illumination, sacrifice. Color: Gold/Amber.
- Venus (The Beauty): Love, harmony, community, nature, beauty. Color: Emerald/Earth/Green.
- Mercury (The Brains): Reason, tools, information, commerce, tech. Color: Cyan/Electric Blue.
- Moon (The Fairy): Emotion, memory, healing, inner world, nature. Color: Silver/Soft Violet.
- Saturn (The Judge): Discipline, oppression, cold lessons, time. Color: Indigo/Charcoal.
- Jupiter (The Queen): Solutions, triumph, expansion, hope, abundance. Color: Royal Purple.

## The 300 Lines:
${fullPoemText}
`;

    console.log("\nSending ALL 300 lines to Gemini in a single call...");
    console.log("(This may take 30-60 seconds to fully analyze)");

    let retries = 4;
    let parsed: any[] = [];

    while (retries > 0) {
        try {
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schemaParams,
                    temperature: 0.1
                }
            });

            if (!result.text) throw new Error("No text returned from API");
            parsed = JSON.parse(result.text);
            console.log(`Gemini returned ${parsed.length} analyzed beats.`);
            break;

        } catch (error: any) {
            retries--;
            const wait = (4 - retries) * 15000; // 15s, 30s, 45s escalating
            console.error(`Error (retries left: ${retries}): ${error.message?.slice(0, 100)}`);
            if (retries > 0) {
                console.log(`Waiting ${wait / 1000}s before retry...`);
                await new Promise(r => setTimeout(r, wait));
            } else {
                console.error("All retries exhausted. Exiting.");
                process.exit(1);
            }
        }
    }

    if (parsed.length < 290) {
        console.error(`Only got ${parsed.length} results — suspiciously low. Check the output manually.`);
    }

    // Merge: for each original beat, find its analysis result
    const finalBeats = beats.map((beat: any) => {
        const analysis = parsed.find((p: any) => p.globalLineIndex === beat.globalLineIndex);
        return {
            ...beat,
            aiParams: {
                tension: Math.max(0, Math.min(1, analysis?.tension ?? 0.5)),
                energy: Math.max(0, Math.min(1, analysis?.energy ?? 0.5)),
                archetype: analysis?.archetype ?? "Sun",
                petroglyph: analysis?.petroglyph ?? "El Humano"
            },
            directorOverride: ""
        };
    });

    fs.writeFileSync(outputPath, JSON.stringify(finalBeats, null, 2), 'utf-8');
    console.log(`\n✓ DONE! Analyzed ${finalBeats.length} lines saved to:\n  ${outputPath}`);

    // Print a quick sample for inspection
    console.log("\n--- Sample: Lines 1, 100, 199, 300 ---");
    [1, 100, 199, 300].forEach(idx => {
        const b = finalBeats.find((x: any) => x.globalLineIndex === idx);
        if (b) console.log(`Line ${idx}: [${b.aiParams.archetype} / ${b.aiParams.petroglyph}] T:${b.aiParams.tension.toFixed(2)} E:${b.aiParams.energy.toFixed(2)} | "${b.text}"`);
    });
}

run();
