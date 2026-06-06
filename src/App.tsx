import React, { useState, useEffect } from 'react';
import { LayoutSettings, KitabPreset } from './types';
import { KITAB_PRESETS, ARABIC_FONTS } from './data/presets';
import FolioViewer from './components/FolioViewer';
import StyleControls from './components/StyleControls';
import CodeExporter from './components/CodeExporter';
import { 
  BookOpen, Sparkles, FileCode, Printer, 
  ChevronRight, ChevronLeft, RefreshCw, Layers, Edit3, HelpCircle 
} from 'lucide-react';

const DEFAULT_SETTINGS: LayoutSettings = {
  paperTexture: 'traditional-yellow',
  borderPattern: 'double-red',
  borderColor: 'red-brown',
  layoutStyle: 'center-frame',
  matanFontSize: 24,
  matanLineHeight: 2.2,
  matanColor: '#1c1917',
  matanFont: '"Amiri", serif',
  syarahFontSize: 13,
  syarahLineHeight: 1.6,
  syarahColor: '#44403c',
  syarahFont: '"Amiri", serif',
  pagePadding: 20,
  borderThickness: 4,
  showJenggotanLines: true,
  jenggotanCount: 1,
  showFolioMetadata: true,
  isArabicRTL: true
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  
  // Custom draft configuration
  const [settings, setSettings] = useState<LayoutSettings>({
    ...DEFAULT_SETTINGS,
    ...KITAB_PRESETS[0].defaultSettings
  });
  const [selectedPresetId, setSelectedPresetId] = useState<string>('mawaiz-al-usfuriyah');
  const [presets, setPresets] = useState<KitabPreset[]>(KITAB_PRESETS);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);

  // Active Kitab Preset object
  const currentPreset = presets.find(p => p.id === selectedPresetId) || presets[0];

  // Sync settings when selecting a preset
  const handlePresetSelect = (presetId: string) => {
    setSelectedPresetId(presetId);
    const selected = presets.find(p => p.id === presetId);
    if (selected) {
      setSettings(prev => ({
        ...prev,
        ...selected.defaultSettings
      }));
    }
    setCurrentPageIndex(0);
  };

  // Live editing text updates
  const handleTextChange = (type: 'matan' | 'syarah', text: string) => {
    const updatedPresets = presets.map(p => {
      if (p.id === selectedPresetId) {
        const updatedPages = [...p.pages];
        if (updatedPages[currentPageIndex]) {
          updatedPages[currentPageIndex] = {
            ...updatedPages[currentPageIndex],
            [type]: text
          };
        }
        return { ...p, pages: updatedPages };
      }
      return p;
    });
    setPresets(updatedPresets);
  };

  // Chapter Name updates
  const handleChapterChange = (text: string) => {
    const updatedPresets = presets.map(p => {
      if (p.id === selectedPresetId) {
        const updatedPages = [...p.pages];
        if (updatedPages[currentPageIndex]) {
          updatedPages[currentPageIndex] = {
            ...updatedPages[currentPageIndex],
            chapterName: text
          };
        }
        return { ...p, pages: updatedPages };
      }
      return p;
    });
    setPresets(updatedPresets);
  };

  // Reset to default preset configurations
  const handleReset = () => {
    setSettings(DEFAULT_SETTINGS);
    const selected = KITAB_PRESETS.find(p => p.id === selectedPresetId);
    if (selected) {
      setSettings(prev => ({
        ...prev,
        ...selected.defaultSettings
      }));
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/40 text-stone-900 font-sans flex flex-col">
      
      {/* APP TOP HERO BANNER */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-700 flex items-center justify-center text-white font-serif font-bold text-lg select-none">
              ك
            </div>
            <div>
              <h1 className="text-sm font-bold text-stone-900 tracking-tight uppercase flex items-center gap-2">
                <span>Kitab Kuning CSS Studio</span>
                <span className="text-[9px] bg-red-100 text-red-800 border border-red-200 px-1.5 py-0.5 rounded font-mono font-bold leading-none">
                  F4 FOLIO STANDARD
                </span>
              </h1>
              <p className="text-xs text-stone-500">
                Penyusun layout e-book, lembar kerja cetak, & CSS klasik standar kitab pesantren gundul.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Tab Selectors */}
            <div className="inline-flex bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'preview' 
                    ? 'bg-white text-stone-950 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Layers size={13} />
                <span>Lembar Kerja</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-all ${
                  activeTab === 'code' 
                    ? 'bg-white text-stone-950 shadow-sm' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <FileCode size={13} />
                <span>Ekspor Kode CSS</span>
              </button>
            </div>

            {/* Quick system actions */}
            <button
              onClick={handleReset}
              title="Reset ke Standar"
              className="p-1.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 rounded-xl cursor-pointer text-stone-600 transition-colors"
            >
              <RefreshCw size={14} />
            </button>
            
            <button
              onClick={() => window.print()}
              title="Cetak Halaman Cetak"
              className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Printer size={13} />
              <span className="hidden sm:inline">Cetak Folio</span>
            </button>
          </div>

        </div>
      </header>

      {/* CORE FRAMEWORK WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col gap-8">
        
        {activeTab === 'preview' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMN 1: INTERACTIVE STYLE ENGINE SIDEBAR (4/12 WIDTH) */}
            <div className="lg:col-span-4 flex flex-col gap-6 no-print">
              
              {/* Quick Info Tip */}
              <div className="bg-amber-50/70 border border-amber-200/60 rounded-2xl p-4 text-xs text-amber-900 leading-relaxed">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="text-amber-700 shrink-0" size={15} />
                  <span className="font-bold">Editor Teks Multi-Interaktif!</span>
                </div>
                Anda dapat memilih karya-karya klasik di bawah, mengubah semua margin, bingkai cetak, kerapatan jenggotan (spasi terjemah), atau <strong>mengeklik/mengedit kata di lembar folio secara langsung</strong> untuk mengubah kalimat Arab tersebut sesuka hati.
              </div>

              {/* Style controls widget */}
              <StyleControls 
                settings={settings}
                onSettingsChange={setSettings}
                selectedPresetId={selectedPresetId}
                onPresetSelect={handlePresetSelect}
              />
            </div>

            {/* COLUMN 2: REAL-TIME PHYSICAL FOLIO VIEW (8/12 WIDTH) */}
            <div className="lg:col-span-8 flex flex-col items-center gap-4">
              
              {/* Book Info Top Deck */}
              <div className="w-full flex items-center justify-between bg-white rounded-2xl border border-stone-200 p-4 shadow-sm no-print">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-strawberry">
                    <BookOpen size={15} className="text-red-700" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-stone-900 leading-tight">
                      Karya: {currentPreset.title}
                    </h2>
                    <p className="text-[10px] text-stone-500 font-sans mt-0.5">
                      Sub kategori: {currentPreset.category} • Karangan {currentPreset.author}
                    </p>
                  </div>
                </div>

                {/* Paginate selector inside active book */}
                {currentPreset.pages.length > 1 && (
                  <div className="flex items-center gap-2 font-sans text-xs">
                    <button
                      disabled={currentPageIndex === 0}
                      onClick={() => setCurrentPageIndex(prev => Math.max(0, prev - 1))}
                      className="p-1.5 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronLeft size={13} />
                    </button>
                    <span className="font-semibold text-stone-700">
                      Hal. {currentPageIndex + 1} dari {currentPreset.pages.length}
                    </span>
                    <button
                      disabled={currentPageIndex === currentPreset.pages.length - 1}
                      onClick={() => setCurrentPageIndex(prev => Math.min(currentPreset.pages.length - 1, prev + 1))}
                      className="p-1.5 bg-stone-50 border border-stone-200 rounded hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                    >
                      <ChevronRight size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Folio Visualizer Sheet container */}
              <div className="w-full bg-stone-200/30 rounded-3xl p-4 md:p-8 border border-stone-200/50 flex flex-col items-center justify-center min-h-[600px] shadow-inner relative overflow-hidden backdrop-blur-xs">
                {/* Background decorative page outline lines */}
                <div className="absolute top-0 bottom-0 left-12 w-0.5 bg-stone-300 pointer-events-none opacity-30 border-r border-dashed" />
                <div className="absolute top-0 bottom-0 right-12 w-0.5 bg-stone-300 pointer-events-none opacity-30 border-l border-dashed" />
                
                <FolioViewer 
                  settings={settings}
                  preset={currentPreset}
                  currentPage={currentPageIndex}
                  onTextChange={handleTextChange}
                  onChapterChange={handleChapterChange}
                />
              </div>

              {/* Fast Inline Translator Panel */}
              <div className="w-full bg-white rounded-2xl border border-stone-200 p-5 shadow-sm space-y-3 select-text no-print">
                <h3 className="text-xs font-bold text-stone-900 tracking-wider uppercase flex items-center gap-2">
                  <Edit3 size={14} className="text-red-700" />
                  <span>Terjemah Bebas Indonesia Halaman Ini</span>
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed italic bg-stone-50/80 p-3 rounded-lg border border-stone-100">
                  "{currentPreset.pages[currentPageIndex]?.translation || 'Terjemahan bab ini belum dimasukkan.'}"
                </p>
                <span className="text-[10px] text-stone-400 block pt-1">
                  Catatan: Baris terjemah di atas dipergunakan pembimbing pengajian santri untuk membandingkan pemaknaan harfiah dengan pemaknaan kontekstual.
                </span>
              </div>

            </div>

          </div>
        ) : (
          /* CODE EXPORTER HUB (100% WIDTH TAB) */
          <div className="no-print">
            <CodeExporter settings={settings} preset={currentPreset} />
          </div>
        )}

      </main>

      {/* FOOTER METADATA CREDITS */}
      <footer className="bg-white border-t border-stone-200 py-6 mt-12 text-stone-500 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs space-y-2">
          <p className="font-serif">
            مطبعة ومكتبة كلاسيك ديجيتال — Standardisasi Kertas Kuning Folio Nusantara v1.4
          </p>
          <p className="font-sans">
            Dibuat secara profesional sesuai kaidah layout percetakan kitab pesantren Nusantara klasik. Mendukung cetak langsung via browser F4.
          </p>
        </div>
      </footer>

    </div>
  );
}
