import React, { useState } from 'react';
import { BookOpen, Table, Grid3X3, Smartphone, Download, Sparkles } from 'lucide-react';
import { ConcentricLogo } from './components/ConcentricLogo';

import Dashboard from './views/Dashboard';
import { PoemFocusView } from './views/PoemFocusView';
// Removed ArtStudioView and PoemAnimationView imports for stability
import PoemView from './views/PoemView';
import { FULL_POEM as poemData } from './data/poem';
import StoryboardTableView from './views/StoryboardTableView';
import VectorTableView from './views/VectorTableView';
import PreviewView from './views/PreviewView';
import { WritingDeskView } from './views/WritingDeskView';
import { ScoreView } from './views/ScoreView';
// import ThumbnailView from './views/ThumbnailView'; // Could be useful but disabling for now if unused
import { useHistory } from './hooks/useHistory';
import type { StoryboardRow, VectorRow, ViewName } from './types';
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
    setAppState(data); // Sync global state
    setCurrentParagraphId(lineId);
  };

  // --- Sync Logic ---
  const handleStoryboardUpdate = (id: string, field: keyof StoryboardRow, value: any) => {
    const updatedStory = storyRows.map(r => r.id === id ? { ...r, [field]: value } : r);
    // Simple sync logic (omitted complex glyph logic for stability)
    setAppState({ storyRows: updatedStory, vectorRows });
  };

  const handleVectorUpdate = (index: number, updates: Partial<VectorRow>) => {
    const updatedVector = vectorRows.map((r, i) => i === index ? { ...r, ...updates } : r);
    setAppState({ storyRows: storyRows, vectorRows: updatedVector });
  };

  const handleBeatClick = (beatId: string) => {
    setCurrentView('preview'); // Simple switch, no frame calculation yet
  };

  // --- Export Logic ---
  const handleExport = () => {
    const exportData = {
      poem: poemData,
      stanza1: {
        storyboard: storyRows,
        vector: vectorRows
      },
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'world_builder_export.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'score': return <ScoreView />;
      case 'procedural': return <WritingDeskView />;
      case 'poem': return <PoemView poem={poemData} onStanzaSelect={handleStanzaSelect} />;
      case 'storyboard': return <StoryboardTableView rows={storyRows} onUpdateRow={handleStoryboardUpdate} onAddRow={() => { }} onDeleteRow={() => { }} />;
      case 'vector': return <VectorTableView rows={vectorRows} onUpdateRow={handleVectorUpdate} onAddRow={() => { }} onDeleteRow={() => { }} onBeatClick={handleBeatClick} />;
      case 'focus': return <PoemFocusView vectorRows={vectorRows} audioUrl={(appState as any).audioSettings?.narrationUrl || undefined} />;
      // Removed ArtStudio and Animation
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30 custom-scrollbar">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-20 lg:w-64'} transition-all duration-300 border-r border-slate-800 flex flex-col items-center lg:items-stretch py-6 bg-black/40 backdrop-blur-md z-50`}>
        <div className={`px-6 mb-8 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center lg:justify-between'} gap-3 transition-all`}>
          <div className="flex items-center gap-3">
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
          <NavItem icon={<Sparkles size={20} />} label="G-3.1 Writing Desk" active={currentView === 'procedural'} onClick={() => setCurrentView('procedural')} collapsed={isSidebarCollapsed} />
          <NavItem icon={<Grid3X3 size={20} />} label="Score View" active={currentView === 'score'} onClick={() => setCurrentView('score')} collapsed={isSidebarCollapsed} />

          <div className="my-2 border-t border-slate-800/50" />

          <NavItem icon={<BookOpen size={20} />} label="Poem Source" active={currentView === 'poem'} onClick={() => setCurrentView('poem')} collapsed={isSidebarCollapsed} />
          <NavItem icon={<Table size={20} />} label="Storyboard" active={currentView === 'storyboard'} onClick={() => setCurrentView('storyboard')} collapsed={isSidebarCollapsed} />

          <div className="my-2 border-t border-slate-800/50" />

          <NavItem icon={<Grid3X3 size={20} />} label="Vector Table" active={currentView === 'vector'} onClick={() => setCurrentView('vector')} collapsed={isSidebarCollapsed} />
          <NavItem icon={<Smartphone size={20} />} label="Focus View" active={currentView === 'focus'} onClick={() => setCurrentView('focus')} collapsed={isSidebarCollapsed} />

          <div className="my-2 border-t border-slate-800/50" />

          <button
            onClick={handleExport}
            className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center lg:justify-start'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-emerald-400 hover:bg-emerald-900/20`}
            title="Export Data"
          >
            <Download size={20} />
            {!isSidebarCollapsed && <span className="hidden lg:block font-medium text-sm whitespace-nowrap">Export Data</span>}
          </button>

        </nav>
      </aside>

      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
}

const NavItem = ({ icon, label, active, onClick, collapsed }: any) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center ${collapsed ? 'justify-center' : 'justify-center lg:justify-start'} gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
  >
    <span className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>{icon}</span>
    {!collapsed && <span className="hidden lg:block font-medium text-sm whitespace-nowrap">{label}</span>}
  </button>
);

export default App;
