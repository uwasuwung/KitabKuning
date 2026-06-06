import React, { useRef, useState, useEffect } from 'react';
import { LayoutSettings, KitabPreset } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, CornerRightDown, Trash2, Edit2, Check, Sparkles, BookOpen } from 'lucide-react';

interface FolioViewerProps {
  settings: LayoutSettings;
  preset: KitabPreset;
  currentPage: number;
  onTextChange: (type: 'matan' | 'syarah', text: string) => void;
  onChapterChange: (text: string) => void;
}

// Preloaded traditional "Makna Gandul" (Jenggotan grammatical annotations) popular in Nusantara pesantren:
// utawi (mubtada), iku (khabar), kerono (maf'ul li-ajlih), soko (jar-majrur), ing (maf'ul bih), hal-e (hal), sopo (fa'il/subjek), opo (fa'il/objek nonhuman)
interface Annotation {
  id: string;
  wordIndex: number;
  symbol: string; // e.g.  "م" (Mubtada), "خ" (Khabar)
  meaning: string; // e.g. "utawi" (adalah / adapun), "iku" (ialah)
  language: 'pegon' | 'indonesia';
}

export default function FolioViewer({
  settings,
  preset,
  currentPage,
  onTextChange,
  onChapterChange
}: FolioViewerProps) {
  const pageData = preset.pages[currentPage] || preset.pages[0];
  
  // Local state for interactive annotations "Makna Jenggotan"
  const [annotations, setAnnotations] = useState<Annotation[]>([
    { id: '1', wordIndex: 5, symbol: 'م', meaning: 'utawi (adapun) rukun-rukun', language: 'pegon' },
    { id: '2', wordIndex: 7, symbol: 'خ', meaning: 'iku (ialah) limo (lima)', language: 'pegon' },
  ]);
  
  const [showAddAnnotation, setShowAddAnnotation] = useState(false);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [newSymbol, setNewSymbol] = useState('م');
  const [newMeaning, setNewMeaning] = useState('');
  
  // Real-time dimensions calculation for scaling
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Folio paper size ratio (F4 is 215.9mm wide and 330.2mm high. Ratio = 0.653)
  // Scaling down to standard screen presentation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const parentWidth = containerRef.current.clientWidth;
        // Target standard width is 640px for a single folio page visualizer
        const cardTargetWidth = Math.min(parentWidth - 32, 600);
        setScale(cardTargetWidth / 600);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Split Matan text to enable word-by-word clicks for traditional Indonesian "makna gandul" annotations!
  const matanWords = pageData.matan.split(/\s+/);

  const handleAddAnnotation = () => {
    if (selectedWordIndex !== null && newMeaning.trim()) {
      const newAnn: Annotation = {
        id: Date.now().toString(),
        wordIndex: selectedWordIndex,
        symbol: newSymbol,
        meaning: newMeaning,
        language: 'pegon'
      };
      setAnnotations([...annotations, newAnn]);
      setNewMeaning('');
      setShowAddAnnotation(false);
      setSelectedWordIndex(null);
    }
  };

  const removeAnnotation = (id: string) => {
    setAnnotations(annotations.filter(ann => ann.id !== id));
  };

  // Get background and styling base on selected paper
  const getPaperBg = () => {
    switch (settings.paperTexture) {
      case 'traditional-yellow':
        return 'bg-[#fbf4db] text-amber-950 shadow-amber-900/10';
      case 'aged-parchment':
        return 'bg-[#f5ebd0] text-stone-900 shadow-stone-800/10 bg-radial-[circle_at_center,rgba(0,0,0,0)_0%,rgba(142,126,104,0.15)_100%]';
      case 'cream-classic':
        return 'bg-[#fdfaf1] text-[#2d2926] border border-[#d2b48c]/30 shadow-amber-950/10';
      case 'clean-white':
        return 'bg-white text-gray-950 border border-gray-100 shadow-gray-200/50';
      default:
        return 'bg-[#fbf4db] text-amber-950';
    }
  };

  // Get Border classes
  const getBorderClass = () => {
    if (settings.borderPattern === 'none') return '';
    
    let colorHex = settings.borderColor;
    if (colorHex === 'red-brown') colorHex = '#b91c1c';
    else if (colorHex === 'gold') colorHex = '#d97706';
    else if (colorHex === 'charcoal') colorHex = '#27272a';

    switch (settings.borderPattern) {
      case 'double-red':
        return `border-4 double border-[${colorHex}]`;
      case 'arabesque-gold':
        return `border-[5px] double border-[${colorHex}] rounded-lg`;
      case 'ornate-accent':
        return `border-2 border-[${colorHex}] rounded-sm`;
      case 'simple-minimal':
        return `border-[1px] solid border-[${colorHex}]`;
      default:
        return 'border-4 double border-red-700';
    }
  };

  const getBorderColorStyle = () => {
    switch (settings.borderColor) {
      case 'red-brown':
        return '#b91c1c';
      case 'gold':
        return '#d97706';
      case 'charcoal':
        return '#3f3f46';
      default:
        return settings.borderColor;
    }
  };

  // Generate background lines for students to write translations ("Jenggotan" lines)
  const renderJenggotanLines = () => {
    if (!settings.showJenggotanLines) return null;
    const lines = [];
    for (let i = 0; i < settings.jenggotanCount; i++) {
      lines.push(
        <div 
          key={i} 
          className="w-full h-0 border-b border-dashed border-red-300 opacity-40 select-none pb-5 mt-1" 
        />
      );
    }
    return lines;
  };

  return (
    <div className="w-full flex flex-col items-center gap-6" ref={containerRef}>
      
      {/* Interactive Sheet Previewer Container with Folio Rulers */}
      <div className="w-full flex flex-col items-center select-none lg:px-4">
        
        {/* Folio Size Ruler Overlay Info */}
        <div className="w-full max-w-[620px] mb-3 flex items-center justify-between text-xs text-stone-500 font-mono px-2">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block animate-pulse"></span>
            <span>Prinjau Klasik: Ukuran Folio (F4) ~ 215.9 x 330.2 mm</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Orientasi: Potret</span>
            <span>Skala Visual: {(scale * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Real-time scaled page frame */}
        <div 
          style={{ 
            width: '600px', 
            height: '920px', 
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          className={`relative shrink-0 rounded shadow-2xl transition-all duration-300 overflow-hidden select-text ${getPaperBg()}`}
        >
          {/* Subtle paper fiber grid */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#b4a06e_1px,transparent_0)] [background-size:12px_12px]" />
          
          {/* Outer Margins Guideline representing printer margins */}
          <div className="absolute inset-[15px] pointer-events-none border border-amber-800/10" />

          {/* Traditional Decorative Corner Ornamentation */}
          {settings.borderPattern !== 'none' && (
            <>
              <div className="absolute top-[22px] left-[22px] w-6 h-6 border-t-2 border-l-2 pointer-events-none" style={{ borderColor: getBorderColorStyle() }} />
              <div className="absolute top-[22px] right-[22px] w-6 h-6 border-t-2 border-r-2 pointer-events-none" style={{ borderColor: getBorderColorStyle() }} />
              <div className="absolute bottom-[22px] left-[22px] w-6 h-6 border-b-2 border-l-2 pointer-events-none" style={{ borderColor: getBorderColorStyle() }} />
              <div className="absolute bottom-[22px] right-[22px] w-6 h-6 border-b-2 border-r-2 pointer-events-none" style={{ borderColor: getBorderColorStyle() }} />
            </>
          )}

          {/* MAIN PAGE BORDER FRAME */}
          <div 
            style={{ 
              borderColor: getBorderColorStyle(),
              borderWidth: settings.borderPattern !== 'none' ? `${settings.borderThickness}px` : '0px',
              borderStyle: settings.borderPattern === 'double-red' || settings.borderPattern === 'arabesque-gold' ? 'double' : 'solid',
              padding: `${settings.pagePadding}px`
            }}
            className="absolute inset-[24px] flex flex-col transition-all duration-300"
          >
            
            {/* 1. HEADER METADATA (Book Title & Margin Info in Classic Style) */}
            {settings.showFolioMetadata && (
              <div className="w-full flex items-center justify-between text-xs pb-2 border-b mb-4 pointer-events-none"
                   style={{ borderColor: `${getBorderColorStyle()}33`, color: `${getBorderColorStyle()}dd` }}>
                <span className="font-sans text-[10px] tracking-wider uppercase font-medium">
                  {preset.category}
                </span>
                <span className="font-serif dir-rtl text-sm font-semibold tracking-wide">
                  {preset.title.split('(')[0].trim()}
                </span>
                <span className="font-sans text-[11px] font-bold">
                  Halaman {pageData.pageNumber}
                </span>
              </div>
            )}

            {/* Editable Chapter Heading */}
            <div className="mb-4 text-center">
              <span 
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => onChapterChange(e.currentTarget.innerText)}
                className="inline-block text-lg font-bold pb-1 px-4 cursor-text hover:bg-black/5 rounded transition-colors"
                style={{ fontFamily: settings.matanFont, color: getBorderColorStyle() }}
              >
                {pageData.chapterName}
              </span>
              <div className="w-24 h-0.5 mx-auto opacity-30 mt-1" style={{ backgroundColor: getBorderColorStyle() }} />
            </div>

            {/* 2. LIVE DOCUMENT CANVAS (Interactive Page layout options) */}
            <div className="flex-1 overflow-y-auto pr-1 select-text kitab-scroll">
              
              {/* LAYOUT OPTION: TRIPLE-HASHIYAH (High Density classical format) */}
              {settings.layoutStyle === 'triple-hashiyah' && (
                <div className="grid grid-cols-12 gap-3 h-full divide-x divide-stone-200/50" dir="rtl">
                  
                  {/* COLUMN 1: Right Side marginal comments - Hashiyah Al-Usfuri (width: 3/12) */}
                  <div className="col-span-3 flex flex-col pl-2 text-right">
                    <span className="text-[9px] tracking-wider font-extrabold uppercase mb-1 px-1 border-r-2" style={{ borderColor: getBorderColorStyle(), color: getBorderColorStyle() }}>
                      حاشية (HASHIYAH MARGIN)
                    </span>
                    <div 
                      className="text-stone-600 leading-normal text-justify whitespace-pre-wrap outline-none"
                      style={{ 
                        fontSize: `${settings.syarahFontSize - 1}px`, 
                        lineHeight: '1.4',
                        fontFamily: settings.syarahFont,
                        color: settings.syarahColor
                      }}
                    >
                      {pageData.translation || 'Tafsir wa Tarjamah.'}
                    </div>
                  </div>

                  {/* COLUMN 2: Center Core - Matan (width: 6/12) */}
                  <div className="col-span-6 flex flex-col px-2 justify-center border-x" style={{ borderColor: `${getBorderColorStyle()}22` }}>
                    <div className="text-center mb-2">
                       <span className="inline-block text-[10px] font-sans font-bold bg-[#8b4513]/10 text-[#8b4513] px-1.5 py-0.5 rounded">
                         الـمـتـن (MATAN AL-ASLI)
                       </span>
                    </div>

                    <div 
                      dir={settings.isArabicRTL ? 'rtl' : 'ltr'}
                      style={{ 
                        fontSize: `${settings.matanFontSize}px`, 
                        lineHeight: settings.matanLineHeight,
                        fontFamily: settings.matanFont,
                        color: settings.matanColor 
                      }}
                      className="text-right leading-relaxed font-bold tracking-wide py-1"
                    >
                      {matanWords.map((word, index) => {
                        const wordAnn = annotations.find(ann => ann.wordIndex === index);
                        return (
                          <span key={index} className="relative inline-block mx-1 group cursor-pointer select-text">
                            <span 
                              className={`hover:bg-amber-700/10 rounded px-1 transition-colors relative ${wordAnn ? 'underline decoration-dotted decoration-red-700 decoration-2' : ''}`}
                              onClick={() => {
                                setSelectedWordIndex(index);
                                setShowAddAnnotation(true);
                              }}
                            >
                              {word}
                            </span>
                            {wordAnn && (
                              <div className="absolute left-1/2 -bottom-5 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto leading-none">
                                <span className="text-[10px] text-red-700 font-bold bg-[#faf6eb] px-0.5 border border-red-300 rounded leading-none select-none">
                                  {wordAnn.symbol}
                                </span>
                                <span className="text-[8px] text-neutral-800 whitespace-nowrap bg-amber-50 px-1 border border-amber-200 rounded mt-[1px] leading-tight select-none">
                                  {wordAnn.meaning}
                                </span>
                              </div>
                            )}
                          </span>
                        );
                      })}
                    </div>

                    {settings.showJenggotanLines && (
                      <div className="mt-4 pt-2 border-t border-dashed" style={{ borderColor: `${getBorderColorStyle()}33` }}>
                        {renderJenggotanLines()}
                      </div>
                    )}
                  </div>

                  {/* COLUMN 3: Left Side - Syarah Commentary (width: 3/12) */}
                  <div className="col-span-3 flex flex-col pr-2 text-right">
                    <span className="text-[9px] tracking-wider font-extrabold uppercase mb-1 px-1 border-r-2" style={{ borderColor: getBorderColorStyle(), color: getBorderColorStyle() }}>
                      شرح (SYARAH AL-KHIDMAH)
                    </span>
                    <div 
                      dir="rtl"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('syarah', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.syarahFontSize}px`, 
                        lineHeight: settings.syarahLineHeight,
                        fontFamily: settings.syarahFont,
                        color: settings.syarahColor 
                      }}
                      className="text-justify leading-relaxed whitespace-pre-wrap outline-none focus:bg-black/5 rounded transition-transform"
                    >
                      {pageData.syarah}
                    </div>
                  </div>

                </div>
              )}

              {/* LAYOUT OPTION: CENTER FRAME (Classical block in-the-middle surrounded by syarah) */}
              {settings.layoutStyle === 'center-frame' && (
                <div className="flex flex-col gap-6 h-full">
                  {/* Central Matan Frame */}
                  <div 
                    style={{ borderColor: `${getBorderColorStyle()}aa` }}
                    className="p-4 bg-black/[0.015] border-2 border-dashed rounded relative"
                  >
                    <span className="absolute -top-3.5 right-4 px-2 text-[10px] bg-[#fbf4db] border border-amber-900/20 text-amber-900 rounded font-bold font-sans">
                      MATAN (متن) - TEKS UTAMA
                    </span>
                    
                    {/* Word-splitted Matan interactive area for Makna Gandul simulator */}
                    <div 
                      dir={settings.isArabicRTL ? 'rtl' : 'ltr'}
                      style={{ 
                        fontSize: `${settings.matanFontSize}px`, 
                        lineHeight: settings.matanLineHeight,
                        fontFamily: settings.matanFont,
                        color: settings.matanColor 
                      }}
                      className="text-right leading-relaxed font-bold tracking-wide py-2"
                    >
                      {matanWords.map((word, index) => {
                        // Find matching annotations
                        const wordAnn = annotations.find(ann => ann.wordIndex === index);
                        return (
                          <span key={index} className="relative inline-block mx-1 group cursor-pointer select-text">
                            <span 
                              className={`hover:bg-amber-700/10 rounded px-1 transition-colors relative ${wordAnn ? 'underline decoration-dotted decoration-red-700 decoration-2' : ''}`}
                              onClick={() => {
                                setSelectedWordIndex(index);
                                setShowAddAnnotation(true);
                              }}
                            >
                              {word}
                            </span>
                            
                            {/* Embedded Traditional annotation representation */}
                            {wordAnn && (
                              <div className="absolute left-1/2 -bottom-5 transform -translate-x-1/2 flex flex-col items-center pointer-events-auto leading-none">
                                <span className="text-[10px] text-red-700 font-bold bg-[#faf6eb] px-0.5 border border-red-300 rounded leading-none select-none">
                                  {wordAnn.symbol}
                                </span>
                                <span className="text-[8px] text-neutral-800 whitespace-nowrap bg-amber-50 px-1 border border-amber-200 rounded mt-[1px] leading-tight select-none">
                                  {wordAnn.meaning}
                                </span>
                              </div>
                            )}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Commentary Syarah box underneath / wrapped */}
                  <div className="flex-1 flex flex-col mt-4 min-h-[220px]">
                    <span className="text-[10px] tracking-wider font-bold mb-2 uppercase flex items-center gap-1.5" style={{ color: getBorderColorStyle() }}>
                      <BookOpen size={13} />
                      SYARAH (شرح) - MATERI KOMENTAR / SYARAH
                    </span>
                    <div 
                      dir={settings.isArabicRTL ? 'rtl' : 'ltr'}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('syarah', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.syarahFontSize}px`, 
                        lineHeight: settings.syarahLineHeight,
                        fontFamily: settings.syarahFont,
                        color: settings.syarahColor 
                      }}
                      className="text-justify leading-relaxed whitespace-pre-wrap outline-none p-2 focus:bg-black/5 rounded transition-transform"
                    >
                      {pageData.syarah}
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT OPTION: DUAL COLUMN (Matan on Right, Syarah on Left) */}
              {settings.layoutStyle === 'dual-column' && (
                <div className="grid grid-cols-2 gap-4 h-full">
                  {/* Commentary Column Left */}
                  <div className="flex flex-col border-r pr-3" style={{ borderColor: `${getBorderColorStyle()}33` }}>
                    <span className="text-[10px] tracking-wider font-bold mb-3 uppercase flex items-center gap-1" style={{ color: getBorderColorStyle() }}>
                      SYARAH (شرح)
                    </span>
                    <div 
                      dir={settings.isArabicRTL ? 'rtl' : 'ltr'}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('syarah', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.syarahFontSize}px`, 
                        lineHeight: settings.syarahLineHeight,
                        fontFamily: settings.syarahFont,
                        color: settings.syarahColor 
                      }}
                      className="text-justify leading-relaxed whitespace-pre-wrap outline-none p-1 focus:bg-black/5 rounded"
                    >
                      {pageData.syarah}
                    </div>
                  </div>

                  {/* Matan Column Right */}
                  <div className="flex flex-col pl-1" dir="rtl">
                    <span className="text-[10px] tracking-wider font-bold mb-3 uppercase text-right" style={{ color: getBorderColorStyle() }}>
                      MATAN (متن)
                    </span>
                    <div 
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('matan', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.matanFontSize}px`, 
                        lineHeight: settings.matanLineHeight,
                        fontFamily: settings.matanFont,
                        color: settings.matanColor 
                      }}
                      className="text-right leading-relaxed font-bold tracking-wide outline-none pb-4"
                    >
                      {pageData.matan}
                    </div>
                    {/* Jenggotan space simulation overlay if toggled */}
                    {settings.showJenggotanLines && (
                      <div className="mt-auto pt-4 border-t border-dashed" style={{ borderColor: `${getBorderColorStyle()}22` }}>
                        <span className="text-[9px] text-amber-800/60 font-sans block mb-1">Ruang Catatan Interlinear (Jenggotan)</span>
                        {renderJenggotanLines()}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LAYOUT OPTION: TOP-BOTTOM (Classic split with decorative layout) */}
              {settings.layoutStyle === 'top-bottom' && (
                <div className="flex flex-col gap-4 h-full">
                  {/* Top Matan Portion */}
                  <div className="pb-4 border-b-2" style={{ borderColor: getBorderColorStyle(), borderStyle: 'double' }}>
                    <span className="text-[10px] tracking-wider font-bold block mb-2" style={{ color: getBorderColorStyle() }}>
                      MATAN (الْمَتْنُ)
                    </span>
                    <div 
                      dir="rtl"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('matan', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.matanFontSize}px`, 
                        lineHeight: settings.matanLineHeight,
                        fontFamily: settings.matanFont,
                        color: settings.matanColor 
                      }}
                      className="text-right leading-relaxed font-bold tracking-wide outline-none"
                    >
                      {pageData.matan}
                    </div>
                  </div>

                  {/* Bottom Syarah Portion */}
                  <div className="pt-2">
                    <span className="text-[10px] tracking-wider font-bold block mb-2" style={{ color: getBorderColorStyle() }}>
                      الشَّرْحُ (KOMENTAR & PENJELASAN)
                    </span>
                    <div 
                      dir={settings.isArabicRTL ? 'rtl' : 'ltr'}
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => onTextChange('syarah', e.currentTarget.innerText)}
                      style={{ 
                        fontSize: `${settings.syarahFontSize}px`, 
                        lineHeight: settings.syarahLineHeight,
                        fontFamily: settings.syarahFont,
                        color: settings.syarahColor 
                      }}
                      className="text-justify leading-relaxed whitespace-pre-wrap outline-none"
                    >
                      {pageData.syarah}
                    </div>
                  </div>
                </div>
              )}

              {/* LAYOUT OPTION: INTERLINEAR GLOSS (Giant spacing layout designed for printing translation pages) */}
              {settings.layoutStyle === 'interlinear-gloss' && (
                <div className="flex flex-col gap-6">
                  <div className="rounded p-4 bg-amber-50/10 border border-amber-900/10">
                    <span className="text-[10px] font-sans font-bold tracking-wide text-amber-900 uppercase block mb-3">
                      Lembaran Makna Gandul Pesantren (Interlinear Space Design)
                    </span>
                    
                    <div dir="rtl" className="flex flex-col gap-8">
                      {/* Splitted lines mapping for realistic dotted line boxes */}
                      {pageData.matan.split('.').filter(Boolean).map((sentence, sIdx) => (
                        <div key={sIdx} className="relative pb-6 border-b border-dashed border-amber-950/20">
                          <p 
                            style={{ 
                              fontSize: `${settings.matanFontSize + 4}px`, 
                              lineHeight: `${settings.matanLineHeight + 0.5}`,
                              fontFamily: settings.matanFont, 
                              color: settings.matanColor 
                            }} 
                            className="text-right font-bold"
                          >
                            {sentence.trim()}.
                          </p>
                          {/* Beautiful guideline dotted grids mimicking classic manuscript notebook lines */}
                          <div className="mt-4 flex flex-col gap-4">
                            <div className="w-full h-0 border-t border-dotted border-red-400/40" />
                            <div className="w-full h-0 border-t border-dotted border-red-400/40" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Marginalia side index */}
                  <div className="p-3 bg-stone-100/50 rounded text-xs select-text">
                    <span className="font-bold block mb-1">Catatan Tambahan Marjinal:</span>
                    <p className="text-stone-600 leading-relaxed font-sans">{pageData.translation}</p>
                  </div>
                </div>
              )}

            </div>

            {/* 3. COLOPHON AND PAGE NUMBER (Traditional design signature) */}
            <div className="w-full flex justify-center items-center pointer-events-none mt-4 pt-1" 
                 style={{ borderTop: `1px solid ${getBorderColorStyle()}22` }}>
              <div 
                className="w-10 h-10 flex items-center justify-center border-2 border-double rounded-full font-serif text-sm font-bold"
                style={{ borderColor: getBorderColorStyle(), color: getBorderColorStyle() }}
              >
                {pageData.pageNumber}
              </div>
            </div>

          </div>

          {/* Dual Watermark Seals representing classic printer guilds */}
          <div className="absolute bottom-6 left-6 opacity-5 pointer-events-none w-16 h-16 rounded-full border border-red-800 flex items-center justify-center text-[8px] uppercase tracking-tighter">
            Press Al-Haramain
          </div>
        </div>

      </div>

      {/* RETAINER COMPENSATOR (Height compensation as scale makes parent collapsed) */}
      <div style={{ height: `${920 * scale - 920}px` }} className="pointer-events-none select-none transition-all duration-300" />

      {/* INTERACTIVE MAKNA GANDUL / ANNOTATIONS DRAWER */}
      <div className="w-full max-w-[600px] bg-white rounded-xl border border-stone-200 shadow-sm p-4 mt-4 select-text">
        <h4 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
          <Sparkles className="text-red-700" size={16} />
          <span>Simulasi Makna Jenggotan (Interlinear Annotations)</span>
        </h4>
        <p className="text-xs text-stone-500 leading-relaxed mb-4">
          Tradisi pengajian di Nusantara menambahkan penanda kode nahwu (tanda rujuk/makna gandul) diagonal di bawah kata Arabic. Klik kata di area <strong>Matan</strong> di atas untuk menambahkan anotasi Anda sendiri!
        </p>

        {/* Existing Annotations lists */}
        <div className="flex flex-wrap gap-2 mb-4">
          {annotations.length === 0 ? (
            <span className="text-xs text-stone-400 italic">Belum ada anotasi ditambahkan. Klik kata pada Matan untuk membuat baru.</span>
          ) : (
            annotations.map(ann => {
              const connectedWord = matanWords[ann.wordIndex] || 'Kata';
              return (
                <div key={ann.id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-amber-50 border border-amber-200 rounded-lg text-xs">
                  <span className="font-bold text-red-700 bg-white border border-red-200 px-1 rounded">{ann.symbol}</span>
                  <span className="text-stone-700"><strong>{connectedWord}</strong>: {ann.meaning}</span>
                  <button 
                    onClick={() => removeAnnotation(ann.id)}
                    className="text-stone-400 hover:text-red-600 transition-colors ml-1 p-0.5"
                    title="Hapus Makna"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Dynamic add view triggered from above click */}
        <AnimatePresence>
          {showAddAnnotation && selectedWordIndex !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3 bg-stone-50 border border-stone-200 rounded-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-stone-700">
                  Tambah Makna ke kata: <strong className="text-red-700">"{matanWords[selectedWordIndex]}"</strong>
                </span>
                <button onClick={() => setShowAddAnnotation(false)} className="text-stone-400 hover:text-stone-600 text-xs">Batal</button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Visual Symbol selectors */}
                <div className="col-span-1">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Kode Nahwu</label>
                  <select 
                    value={newSymbol} 
                    onChange={(e) => setNewSymbol(e.target.value)}
                    className="w-full text-xs p-1.5 bg-white border border-stone-300 rounded"
                  >
                    <option value="م">م (Mubtada' - adapun)</option>
                    <option value="خ">خ (Khabar - ialah)</option>
                    <option value="ف">ف (Fa'il - siapa/apa)</option>
                    <option value="مف">مف (Maf'ul bih - ing)</option>
                    <option value="حال">حال (Hal - hal - keadaan)</option>
                    <option value="ح">ح (Huruf)</option>
                    <option value="ظ">ظ (Zhorof)</option>
                  </select>
                </div>

                {/* Translation / Meaning Text */}
                <div className="col-span-2">
                  <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Terjemah Makna (Pegon / Indonesia)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. utawi kawitane, ing..."
                      value={newMeaning}
                      onChange={(e) => setNewMeaning(e.target.value)}
                      className="flex-1 text-xs px-2 py-1.5 bg-white border border-stone-300 rounded focus:ring-1 focus:ring-red-600 outline-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddAnnotation();
                      }}
                    />
                    <button 
                      onClick={handleAddAnnotation}
                      className="px-3 py-1.5 bg-red-700 text-white hover:bg-red-800 rounded text-xs font-medium flex items-center gap-1 shrink-0"
                    >
                      <Plus size={14} /> Simpan
                    </button>
                  </div>
                </div>

              </div>
              <p className="text-[10px] text-stone-400 mt-2">
                Tip: Tekan Enter untuk menyimpan penanda anotasi dengan cepat. Anotasi akan dirender tepat di bawah kata pilihan secara diagonal.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
