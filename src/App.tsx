import React, { useState } from 'react';
import { BookOpen, Table, Image, MonitorPlay, RotateCcw, RotateCw, Grid3X3 } from 'lucide-react';
import { ConcentricLogo } from './components/ConcentricLogo';

import Dashboard from './views/Dashboard';
import PoemView from './views/PoemView';
import { FULL_POEM as poemData } from './data/poem';
import StoryboardTableView from './views/StoryboardTableView';
import VectorTableView from './views/VectorTableView';
import PreviewView from './views/PreviewView';
import ThumbnailView from './views/ThumbnailView';
import { useHistory } from './hooks/useHistory';
import VersionSnapshots from './components/VersionSnapshots';
import { OnboardingGuide } from './components/OnboardingGuide';
import type { StoryboardRow, VectorRow, SavedGlyph, ViewName } from './types';
import { HumanPosture, GlyphVerb, SetupTransition, MotionSpeed } from './types';

import { PARAGRAPH_1_STORYBOARD, PARAGRAPH_1_VECTOR } from './data/stanza1';
import { loadStanzaData } from './data/loader';

function App() {
  const [currentView, setCurrentView] = useState<ViewName>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentParagraphId, setCurrentParagraphId] = useState<number | null>(null);
  const [previewFrame, setPreviewFrame] = useState<number | null>(null);

  // Undo/Redo History for Global State
  const {
    state: appState,
    set: setAppState,
    undo,
    redo,
    canUndo,
    canRedo
  } = useHistory({
    storyRows: PARAGRAPH_1_STORYBOARD,
    vectorRows: PARAGRAPH_1_VECTOR
  });

  const { storyRows, vectorRows } = appState;

  // --- Stanza/Line Selection Logic ---
  const handleStanzaSelect = (lineId: number) => {
    const data = loadStanzaData(lineId);

    // Update global state with the new data
    setAppState(data);

    // Update UI state
    setCurrentParagraphId(lineId);
    // Stay in Poem view to allow editing
    // setCurrentView('storyboard');
  };

  // --- Sync Logic ---

  const handleStoryboardUpdate = (id: string, field: keyof StoryboardRow, value: any) => {
    // 1. Update Storyboard Row
    const updatedStory = storyRows.map(r => r.id === id ? { ...r, [field]: value } : r);

    // 2. Find index to sync with Vector Row
    const index = storyRows.findIndex(r => r.id === id);
    let updatedVector = [...vectorRows];

    if (index !== -1 && vectorRows[index]) {
      const targetVector = { ...vectorRows[index] };
      let syncNeeded = false;

      // Sync Glyph Count
      if (field === 'glyphCount') {
        const count = value as number;
        if (count >= 0) {
          if (targetVector.glyphs.length === 0) {
            if (count > 0) {
              targetVector.glyphs = [{ count: count, posture: HumanPosture.Posture1, position: [0.5, 0.5], size: 3, faceColor: '#fff' }];
            }
          } else {
            targetVector.glyphs[0] = { ...targetVector.glyphs[0], count: count };
          }
        }
        syncNeeded = true;
      }

      // Sync Postures
      if (field === 'postures') {
        const postures = value as any[]; // Type check
        if (targetVector.glyphs.length > 0 && postures.length > 0) {
          targetVector.glyphs[0] = { ...targetVector.glyphs[0], posture: postures[0] };
          syncNeeded = true;
        }
      }

      // Sync Face Colors
      if (field === 'faceColors') {
        const colors = value as string[];
        if (targetVector.glyphs.length > 0 && colors.length > 0) {
          targetVector.glyphs[0] = { ...targetVector.glyphs[0], faceColor: colors[0] };
          syncNeeded = true;
        }
      }

      // Sync Shapes
      if (field === 'shapesIntroduced') {
        const shapes = value as any[];
        if (shapes.length > 0) {
          const currentShape = targetVector.shapes[0] || { type: 'Circle', function: 'Decoration', position: [0.5, 0.5], size: 3, rotation: 0 };
          targetVector.shapes[0] = { ...currentShape, type: shapes[0] };
          syncNeeded = true;
        }
      }

      // Sync Verb
      if (field === 'glyphVerb') {
        targetVector.motion.verb = value as GlyphVerb;
        syncNeeded = true;
      }

      // Sync Transition
      if (field === 'setupTransition') {
        targetVector.motion.transition = value as SetupTransition;
        syncNeeded = true;
      }

      // Sync SFX Override
      if (field === 'sfxOverride') {
        targetVector.sfxOverride = value as string;
        syncNeeded = true;
      }

      // Sync SFX Mute
      if (field === 'sfxMute') {
        targetVector.sfxMute = value as boolean;
        syncNeeded = true;
      }

      if (syncNeeded) {
        updatedVector = vectorRows.map((r, i) => i === index ? targetVector : r);
      }
    }

    setAppState({ storyRows: updatedStory, vectorRows: updatedVector });
  };

  const handleVectorUpdate = (index: number, updates: Partial<VectorRow>) => {
    // 1. Update the Vector Row
    const updatedVector = vectorRows.map((r, i) => i === index ? { ...r, ...updates } : r);
    const targetRow = updatedVector[index];

    // 2. Reverse Sync: Update the corresponding Storyboard Row based on the single source of truth (Vector)
    const updatedStory = storyRows.map(sRow => {
      // Find matching storyboard row by ID
      if (sRow.id === targetRow.beatId) {
        // Calculate aggregated values from the Vector row
        const totalGlyphs = targetRow.glyphs.reduce((sum, g) => sum + (g.count || 0), 0);

        // Get unique values for list-based fields
        const distinctPostures = Array.from(new Set(targetRow.glyphs.map(g => g.posture).filter(Boolean)));
        const distinctColors = Array.from(new Set(targetRow.glyphs.map(g => g.faceColor).filter(Boolean)));
        const distinctShapes = Array.from(new Set(targetRow.shapes.map(s => s.type).filter(Boolean)));

        return {
          ...sRow,
          glyphCount: totalGlyphs,
          // Sync lists (if vector has data, overwrite storyboard; otherwise keep empty)
          postures: distinctPostures.length > 0 ? distinctPostures : [],
          faceColors: distinctColors.length > 0 ? distinctColors : [],
          shapesIntroduced: distinctShapes.length > 0 ? distinctShapes : [],

          // Sync singular fields
          glyphVerb: targetRow.motion.verb,
          setupTransition: targetRow.motion.transition,
          sfxMute: targetRow.sfxMute,
          sfxOverride: targetRow.sfxOverride
        };
      }
      return sRow;
    });

    setAppState({ storyRows: updatedStory, vectorRows: updatedVector });
  };

  const handleBeatClick = (beatId: string) => {
    // 1. Find the index in vector rows
    const index = vectorRows.findIndex(r => r.beatId === beatId);
    if (index !== -1) {
      // 2. Calculate start frame
      const startFrame = vectorRows.slice(0, index).reduce((acc, row) => acc + (Math.floor(row.duration * 30)), 0);
      // 3. Set Preview Time and Switch View
      setPreviewFrame(startFrame);
      setCurrentView('preview');
      setTimeout(() => setPreviewFrame(null), 1000); // Reset after jump so we don't stick
    }
  };

  const handleRowOperation = (action: 'split' | 'merge' | 'add', index: number, payload?: any) => {
    let newStoryRows = [...storyRows];
    let newVectorRows = [...vectorRows];

    if (action === 'split') {
      const currentRowVector = newVectorRows[index];
      const currentRowStory = newStoryRows.find(r => r.id === currentRowVector.beatId);

      if (!currentRowVector || !currentRowStory) return;

      const text = currentRowVector.textSync;
      const cursor = payload?.cursor || text.length;

      const firstHalf = text.slice(0, cursor);
      const secondHalf = text.slice(cursor);

      // Update current vector row
      newVectorRows[index] = { ...currentRowVector, textSync: firstHalf };

      // Create new rows
      const newBeatId = `sb-${Date.now()}`;
      const newVectorRow: VectorRow = {
        ...currentRowVector,
        beatId: newBeatId,
        textSync: secondHalf,
        glyphs: [], // Reset glyphs for new beat
        shapes: [],
        timeStart: (parseFloat(currentRowVector.timeStart) + currentRowVector.duration).toString(),
        notes: `Split from ${currentRowVector.beatId}`
      };
      const newStoryRow: StoryboardRow = {
        id: newBeatId,
        beatId: 0, // Will be re-indexed
        linesCovered: currentRowStory.linesCovered,
        imageType: currentRowStory.imageType,
        glyphCount: 0,
        postures: [],
        faceColors: [],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Static,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: `Split from ${currentRowStory.id}`
      };

      newVectorRows.splice(index + 1, 0, newVectorRow);
      newStoryRows.splice(index + 1, 0, newStoryRow);

    } else if (action === 'merge') {
      if (index > 0) {
        const prevRowVector = newVectorRows[index - 1];
        const currentRowVector = newVectorRows[index];

        if (!prevRowVector || !currentRowVector) return;

        // Merge text
        const mergedText = prevRowVector.textSync + (prevRowVector.textSync ? ' ' : '') + currentRowVector.textSync;
        newVectorRows[index - 1] = { ...prevRowVector, textSync: mergedText };

        // Remove current row from vector
        newVectorRows.splice(index, 1);

        // Remove from story rows (find by ID)
        const storyIndex = newStoryRows.findIndex(r => r.id === currentRowVector.beatId);
        if (storyIndex !== -1) {
          newStoryRows.splice(storyIndex, 1);
        }
      }
    } else if (action === 'add') {
      const newId = `sb-${Date.now()}`;
      const newStoryRow: StoryboardRow = {
        id: newId,
        beatId: 0, // Will be re-indexed
        linesCovered: '-',
        imageType: 'Abstract',
        glyphCount: 0,
        postures: [],
        faceColors: [],
        shapesIntroduced: [],
        glyphVerb: GlyphVerb.Static,
        setupTransition: SetupTransition.FadeIn,
        intentPacing: '-'
      };
      const newVectorRow: VectorRow = {
        beatId: newId,
        timeStart: (vectorRows.length * 5).toString(), // Placeholder, will be adjusted by user
        duration: 5,
        glyphs: [],
        shapes: [],
        compositionRule: 'Center',
        motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Medium, transition: SetupTransition.FadeIn, easing: 'linear' },
        textSync: '',
        notes: ''
      };

      newStoryRows.splice(index + 1, 0, newStoryRow);
      newVectorRows.splice(index + 1, 0, newVectorRow);
    }

    // Re-index beatIds for display
    newStoryRows = newStoryRows.map((r, i) => ({ ...r, beatId: i + 1 }));

    setAppState({ storyRows: newStoryRows, vectorRows: newVectorRows });
  };

  const addBeat = () => {
    const newId = `sb-${Date.now()}`;
    const newStoryRow: StoryboardRow = {
      id: newId,
      beatId: storyRows.length + 1, // Fixed to beatId per interface
      linesCovered: '-',
      imageType: 'Abstract',
      glyphCount: 0,
      postures: [],
      faceColors: [],
      shapesIntroduced: [],
      glyphVerb: GlyphVerb.Static,
      setupTransition: SetupTransition.FadeIn,
      intentPacing: '-'
    };
    const newVectorRow: VectorRow = {
      beatId: newId,
      timeStart: (vectorRows.length * 5).toString(),
      duration: 5,
      glyphs: [],
      shapes: [],
      compositionRule: 'Center',
      motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Medium, transition: SetupTransition.FadeIn, easing: 'linear' },
      textSync: '',
      notes: ''
    };
    setAppState({
      storyRows: [...storyRows, newStoryRow],
      vectorRows: [...vectorRows, newVectorRow]
    });
  };

  const deleteBeat = (id: string) => {
    const index = storyRows.findIndex(r => r.id === id);
    if (index === -1) return;

    const newStoryRows = storyRows.filter(r => r.id !== id);
    const newVectorRows = vectorRows.filter((_, i) => i !== index);

    // Re-index beatIds
    const reindexedStory = newStoryRows.map((row, i) => ({ ...row, beatId: i + 1 }));

    setAppState({
      storyRows: reindexedStory,
      vectorRows: newVectorRows
    });
  };

  const handleLoadSnapshot = (data: any) => {
    if (data && data.storyRows && data.vectorRows) {
      setAppState(data);
    }
  };


  // --- Glyph Library Logic ---
  const [savedGlyphs, setSavedGlyphs] = useState<SavedGlyph[]>(() => {
    const saved = localStorage.getItem('glyph_library');
    return saved ? JSON.parse(saved) : [];
  });

  const saveGlyphPreset = (name: string, glyphs: any[], shapes: any[]) => {
    // Create a full SavedGlyph object
    const newGlyph: SavedGlyph = {
      id: Date.now().toString(),
      name,
      glyphs,
      shapes,
      motion: { verb: GlyphVerb.Static, speed: MotionSpeed.Normal, transition: SetupTransition.FadeIn }, // Default or passed
      compositionRule: 'Center'
    };

    const updated = [...savedGlyphs, newGlyph];
    setSavedGlyphs(updated);
    localStorage.setItem('glyph_library', JSON.stringify(updated));
  };

  const handleInsertGlyph = (glyph: SavedGlyph) => {
    // Add as a new beat
    const newId = `sb-${storyRows.length + 1}`;
    const newStoryRow: StoryboardRow = {
      id: newId,
      beatId: storyRows.length + 1,
      linesCovered: '-',
      imageType: 'Metaphor',
      glyphCount: glyph.glyphs.reduce((acc, g) => acc + g.count, 0),
      postures: glyph.glyphs.map(g => g.posture),
      faceColors: glyph.glyphs.map(g => g.faceColor),
      shapesIntroduced: glyph.shapes.map(s => s.type),
      glyphVerb: glyph.motion.verb,
      setupTransition: glyph.motion.transition,
      intentPacing: `Inserted from library: ${glyph.name}`
    };

    const newVectorRow: VectorRow = {
      beatId: newId,
      timeStart: (vectorRows.length * 5).toString(),
      duration: 5,
      glyphs: glyph.glyphs,
      shapes: glyph.shapes,
      compositionRule: glyph.compositionRule,
      motion: { ...glyph.motion, easing: 'easeInOut' },
      textSync: '',
      notes: glyph.name
    };

    setAppState({
      storyRows: [...storyRows, newStoryRow],
      vectorRows: [...vectorRows, newVectorRow]
    });
    alert(`Inserted "${glyph.name}" as new beat.`);
  };

  const renderView = () => {
    switch (currentView) {
      case 'poem': return <PoemView
        poem={poemData}
        onStanzaSelect={handleStanzaSelect}
        activeParagraphId={currentParagraphId}
        vectorRows={vectorRows}
        onUpdateVectorRow={handleVectorUpdate}
        onRowOperation={handleRowOperation}
      />;
      case 'storyboard':
        return <StoryboardTableView
          rows={storyRows}
          onUpdateRow={handleStoryboardUpdate}
          onAddRow={addBeat}
          onDeleteRow={deleteBeat}
          onSaveGlyph={saveGlyphPreset}
          onBeatClick={handleBeatClick}
        />;
      case 'vector':
        return <VectorTableView
          rows={vectorRows}
          onUpdateRow={handleVectorUpdate}
          onAddRow={addBeat}
          onDeleteRow={deleteBeat}
          onBeatClick={handleBeatClick}
        />;
      case 'dashboard':
        return <Dashboard />;
      case 'preview':
        return <PreviewView
          vectorRows={vectorRows}
          storyRows={storyRows}
          onUpdateRow={handleVectorUpdate}
          initialFrame={previewFrame}
        />;
      case 'thumbnail':
        return <ThumbnailView
          savedGlyphs={savedGlyphs}
          onInsertGlyph={handleInsertGlyph}
        />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-light text-slate-300 mb-4 flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-400" />
                Poem Source
              </h2>
              <p className="text-slate-500 mb-4">View and select poem segments to analyze.</p>
              <button
                onClick={() => setCurrentView('poem')}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Open Poem
              </button>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-light text-slate-300 mb-4 flex items-center gap-2">
                <Table size={20} className="text-pink-400" />
                Storyboard Table
              </h2>
              <p className="text-slate-500 mb-4">Define glyph counts, shapes, and intent per beat.</p>
              <button
                onClick={() => setCurrentView('storyboard')}
                className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Open Storyboard
              </button>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-light text-slate-300 mb-4 flex items-center gap-2">
                <Grid3X3 size={20} className="text-emerald-400" />
                Vector Table
              </h2>
              <p className="text-slate-500 mb-4">Fine-tune positions, rendering, and animation logic.</p>
              <button
                onClick={() => setCurrentView('vector')}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Open Vector Table
              </button>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-light text-slate-300 mb-4 flex items-center gap-2">
                <MonitorPlay size={20} className="text-blue-400" />
                Preview
              </h2>
              <p className="text-slate-500 mb-4">Watch the animation come to life.</p>
              <button
                onClick={() => setCurrentView('preview')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Open Preview
              </button>
            </div>

            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
              <h2 className="text-xl font-light text-slate-300 mb-4 flex items-center gap-2">
                <Image size={20} className="text-purple-400" />
                Thumbnails
              </h2>
              <p className="text-slate-500 mb-4">Browse and manage saved glyph compositions.</p>
              <button
                onClick={() => setCurrentView('thumbnail')}
                className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Open Thumbnails
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 custom-scrollbar">
      {/* Sidebar */}
      {/* Sidebar - Collapsible */}
      <aside
        className={`${isSidebarCollapsed ? 'w-20' : 'w-20 lg:w-64'} transition-all duration-300 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-6 bg-black/40 backdrop-blur-md z-50`}
      >
        <div className={`px-6 mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center lg:justify-between'} gap-3 transition-all`}>
          <div className="flex items-center gap-3"> {/* Wrapper for Logo + Text */}
            <div className="w-8 h-8 flex-shrink-0 cursor-pointer" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
              <ConcentricLogo className="w-full h-full text-indigo-500 hover:text-indigo-400 transition-colors" />
            </div>
            {!isSidebarCollapsed && (
              <span className="hidden lg:block font-bold text-lg tracking-wider text-slate-200 whitespace-nowrap">
                WORLD<span className="font-light text-slate-500">BUILDER</span>
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2 w-full px-2">
          <NavItem
            icon={<BookOpen size={20} />}
            label="Poem Source"
            active={currentView === 'poem'}
            onClick={() => setCurrentView('poem')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Table size={20} />}
            label="Storyboard"
            active={currentView === 'storyboard'}
            onClick={() => setCurrentView('storyboard')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Grid3X3 size={20} />}
            label="Vector Table"
            active={currentView === 'vector'}
            onClick={() => setCurrentView('vector')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<MonitorPlay size={20} />}
            label="Preview"
            active={currentView === 'preview'}
            onClick={() => setCurrentView('preview')}
            collapsed={isSidebarCollapsed}
          />
          <NavItem
            icon={<Image size={20} />}
            label="Thumbnails"
            active={currentView === 'thumbnail'}
            onClick={() => setCurrentView('thumbnail')}
            collapsed={isSidebarCollapsed}
          />
        </nav>

        <div className={`px-4 mt-auto w-full flex ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <VersionSnapshots
            currentData={appState}
            onLoad={(state: any) => setAppState(state)}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-slate-950 to-black pointer-events-none" />

        {/* Header Toolbar */}
        <header className="h-16 border-b border-slate-800/50 bg-black/20 backdrop-blur flex items-center justify-between px-8 relative z-20">
          <h1 className="text-lg font-medium text-slate-400">{currentView.charAt(0).toUpperCase() + currentView.slice(1).replace(/([A-Z])/g, ' $1').trim()}</h1>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('wb_open_help'))}
              className="p-2 mr-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Help & Guide"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg transition-colors ${canUndo ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-700 cursor-not-allowed'}`}
              title="Undo"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg transition-colors ${canRedo ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-700 cursor-not-allowed'}`}
              title="Redo"
            >
              <RotateCw size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 relative z-10 custom-scrollbar">
          {renderView()}
        </div>
      </main>
      <OnboardingGuide />
    </div >
  );
}

const NavItem = ({ icon, label, active, onClick, collapsed }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void, collapsed: boolean }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-center lg:justify-start'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
      ${active
        ? 'bg-indigo-600/10 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)] border border-indigo-500/20'
        : 'text-slate-500 hover:bg-slate-900/50 hover:text-slate-300 border border-transparent'
      }`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
    {!collapsed && <span className="hidden lg:block font-medium text-sm whitespace-nowrap">{label}</span>}
  </button>
);

export default App;
