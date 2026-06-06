import React from 'react';
import { LayoutSettings, KitabPreset, PaperTexture, BorderPattern, LayoutStyle } from '../types';
import { KITAB_PRESETS, ARABIC_FONTS } from '../data/presets';
import { 
  Book, Sliders, Palette, Layout, Type, Layers, 
  HelpCircle, RefreshCw, FileCode, Check, Star 
} from 'lucide-react';

interface StyleControlsProps {
  settings: LayoutSettings;
  onSettingsChange: (settings: LayoutSettings) => void;
  selectedPresetId: string;
  onPresetSelect: (presetId: string) => void;
}

export default function StyleControls({
  settings,
  onSettingsChange,
  selectedPresetId,
  onPresetSelect
}: StyleControlsProps) {

  const handleUpdate = <K extends keyof LayoutSettings>(key: K, value: LayoutSettings[K]) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const currentPreset = KITAB_PRESETS.find(p => p.id === selectedPresetId);

  return (
    <div className="w-full flex flex-col gap-6 bg-stone-50 p-5 rounded-2xl border border-stone-200 shadow-sm">
      
      {/* SECTION 1: PRESENTS & KITAB TEMPLATES */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Book className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Template Kitab Klasik</h3>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {KITAB_PRESETS.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            return (
              <button
                key={preset.id}
                onClick={() => onPresetSelect(preset.id)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? 'border-red-700 bg-red-50/50 shadow-sm' 
                    : 'border-stone-200 bg-white hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isSelected ? 'text-red-800' : 'text-stone-700'}`}>
                    {preset.title.split('(')[0].trim()}
                  </span>
                  {isSelected && <Star size={12} className="text-red-700 fill-red-700" />}
                </div>
                <div className="text-[10px] text-stone-500 font-sans mt-0.5 mt-1 line-clamp-1">
                  {preset.subtitle}
                </div>
                <div className="text-[9px] text-stone-400 font-sans mt-1">
                  Oleh: {preset.author}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-stone-200" />

      {/* SECTION 2: BOOK LAYOUT ARCHITECTURE */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layout className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Arsitektur Tata Letak</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'triple-hashiyah', label: 'Syarah Hashiyah Klasik', desc: 'Matan dikelilingi syarah penuh & hiasan high-density' },
            { id: 'center-frame', label: 'Frame Tengah (Matan)', desc: 'Matan dikelilingi syarah mendatar' },
            { id: 'dual-column', label: 'Dua Kolom (Samping)', desc: 'Matan kanan, Syarah kiri' },
            { id: 'top-bottom', label: 'Atas - Bawah', desc: 'Dibelah garis hias klasik' },
            { id: 'interlinear-gloss', label: 'Spasi Makna Gandul', desc: 'Format renggang makna jenggot' }
          ].map((layout) => {
            const isSelected = settings.layoutStyle === layout.id;
            return (
              <button
                key={layout.id}
                onClick={() => handleUpdate('layoutStyle', layout.id as LayoutStyle)}
                className={`p-2.5 rounded-lg border text-left cursor-pointer transition-all ${
                  isSelected 
                    ? 'bg-stone-900 text-white border-stone-900' 
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="text-xs font-bold">{layout.label}</div>
                <div className={`text-[9px] mt-0.5 line-clamp-2 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {layout.desc}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-stone-200" />

      {/* SECTION 3: TEXTURE & PAPER PALETTE */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Warna Kertas & Tekstur</h3>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'traditional-yellow', label: 'Kuning Kitab', color: 'bg-[#fcf6e5] border-[#dfd6bc]', desc: 'Kertas porous kuning jerami khas pesantren' },
            { id: 'aged-parchment', label: 'Naskah Kuno', color: 'bg-[#f3ead3] border-[#cfc0a2]', desc: 'Manuskrip lama bertekstur pudar' },
            { id: 'cream-classic', label: 'Leksikon Krem', color: 'bg-[#faf6eb] border-[#e7dec6]', desc: 'Krem premium nyaman dibaca lama' },
            { id: 'clean-white', label: 'HVS Putih', color: 'bg-white border-stone-200', desc: 'Kertas modern bersih untuk print jernih' }
          ].map((paper) => {
            const isSelected = settings.paperTexture === paper.id;
            return (
              <button
                key={paper.id}
                onClick={() => handleUpdate('paperTexture', paper.id as PaperTexture)}
                className={`flex gap-3 p-2 rounded-xl border text-left items-center cursor-pointer transition-all ${
                  isSelected ? 'ring-2 ring-red-700 bg-white' : 'bg-white hover:border-stone-300'
                }`}
              >
                <span className={`w-6 h-6 rounded border ${paper.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-stone-800">{paper.label}</div>
                  <div className="text-[9px] text-stone-500 line-clamp-1">{paper.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-stone-200" />

      {/* SECTION 4: DECORATIVE FRAME BINGKAI */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Bingkai Alur & Garis Pembatas</h3>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { id: 'double-red', label: 'Garis Ganda Merah' },
            { id: 'arabesque-gold', label: 'Garis Tebal Emas' },
            { id: 'ornate-accent', label: 'Aksen Vintage Tipis' },
            { id: 'simple-minimal', label: 'Minimalis Tunggal' },
            { id: 'none', label: 'Tanpa Bingkai (Polos)' }
          ].map((border) => {
            const isSelected = settings.borderPattern === border.id;
            return (
              <button
                key={border.id}
                onClick={() => handleUpdate('borderPattern', border.id as BorderPattern)}
                className={`px-2 py-1.5 rounded text-[11px] font-bold border cursor-pointer text-center transition-all ${
                  isSelected 
                    ? 'bg-red-700 text-white border-red-700' 
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                {border.label}
              </button>
            );
          })}
        </div>

        {/* Sliders for border dimension if border is active */}
        {settings.borderPattern !== 'none' && (
          <div className="space-y-2 mt-3 bg-stone-100/50 p-2.5 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Ketebalan Bingkai</span>
              <span className="font-mono font-bold">{settings.borderThickness}px</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="8" 
              value={settings.borderThickness}
              onChange={(e) => handleUpdate('borderThickness', parseInt(e.target.value))}
              className="w-full accent-red-700"
            />

            <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-stone-600">Warna Tinta Bingkai</span>
            </div>
            <div className="flex gap-2 mt-1">
              {[
                { name: 'Saddle Brown Klasik', hex: '#8b4513', bg: 'bg-[#8b4513]' },
                { name: 'Merah Bata Lambat', hex: 'red-brown', bg: 'bg-[#b91c1c]' },
                { name: 'Kuning Kuningan', hex: 'gold', bg: 'bg-[#d97706]' },
                { name: 'Arang Hitam Kuno', hex: 'charcoal', bg: 'bg-[#3f3f46]' }
              ].map((color) => {
                const isSel = settings.borderColor === color.hex;
                return (
                  <button
                    key={color.hex}
                    title={color.name}
                    onClick={() => handleUpdate('borderColor', color.hex)}
                    className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center transition-transform ${color.bg} ${
                      isSel ? 'ring-2 ring-stone-900 ring-offset-2 scale-110' : 'hover:scale-105'
                    }`}
                  >
                    {isSel && <Check size={10} className="text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <hr className="border-stone-200" />

      {/* SECTION 5: ARABIC TYPOGRAPHY SCALING */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Tipografi Arabiyah & Ukuran</h3>
        </div>

        {/* Font Selection Dropdown */}
        <div className="mb-4">
          <label className="block text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-1">Gaya Khat / Font Huruf Utama</label>
          <select
            value={settings.matanFont}
            onChange={(e) => {
              handleUpdate('matanFont', e.target.value);
              handleUpdate('syarahFont', e.target.value);
            }}
            className="w-full text-xs p-2 bg-white border border-stone-200 rounded-lg outline-none focus:ring-1 focus:ring-red-700"
          >
            {ARABIC_FONTS.map(font => (
              <option key={font.id} value={font.cssValue}>{font.name}</option>
            ))}
          </select>
        </div>

        {/* Sliders Area */}
        <div className="space-y-3 bg-stone-100/50 p-3 rounded-lg">
          <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-2">Ukuran Huruf & Tinggi Baris (متن)</h4>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Font Matan</span>
            <span className="font-mono font-bold">{settings.matanFontSize}px</span>
          </div>
          <input 
            type="range" 
            min="18" 
            max="36" 
            value={settings.matanFontSize}
            onChange={(e) => handleUpdate('matanFontSize', parseInt(e.target.value))}
            className="w-full accent-red-700"
          />

          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Kerapatan / Tinggi Baris Matan</span>
            <span className="font-mono font-bold">{settings.matanLineHeight}x</span>
          </div>
          <input 
            type="range" 
            min="1.6" 
            max="3.5" 
            step="0.1"
            value={settings.matanLineHeight}
            onChange={(e) => handleUpdate('matanLineHeight', parseFloat(e.target.value))}
            className="w-full accent-red-700"
          />

          <h4 className="text-[10px] uppercase tracking-wider font-bold text-stone-600 pt-2 mb-2">Ukuran Komentar / Terjemah (شرح)</h4>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone-600">Font Syarah</span>
            <span className="font-mono font-bold">{settings.syarahFontSize}px</span>
          </div>
          <input 
            type="range" 
            min="11" 
            max="18" 
            value={settings.syarahFontSize}
            onChange={(e) => handleUpdate('syarahFontSize', parseInt(e.target.value))}
            className="w-full accent-red-700"
          />
        </div>
      </div>

      <hr className="border-stone-200" />

      {/* SECTION 6: AUXILIARY SETTINGS (Pesantren specific toggles) */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sliders className="text-red-700" size={18} />
          <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">Perangkat Atribut Tradisional</h3>
        </div>

        <div className="space-y-3">
          {/* Toggle Folio Margnal Headings */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={settings.showFolioMetadata}
              onChange={(e) => handleUpdate('showFolioMetadata', e.target.checked)}
              className="mt-0.5 accent-red-700 rounded"
            />
            <div className="text-xs">
              <span className="font-bold text-stone-800 block">Keterangan Kolofon & Halaman</span>
              <span className="text-stone-500 text-[10px]">Tampilkan judul bab, kategori, dan nomor halaman di batas margin.</span>
            </div>
          </label>

          {/* Toggle Jenggotan placeholder helper lines */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox"
              checked={settings.showJenggotanLines}
              onChange={(e) => handleUpdate('showJenggotanLines', e.target.checked)}
              className="mt-0.5 accent-red-700 rounded"
            />
            <div className="text-xs">
              <span className="font-bold text-stone-800 block">Persiapan Baris Makna (Jenggotan)</span>
              <span className="text-stone-500 text-[10px]">Cetak garis bantu putus-putus merah di sela teks untuk latihan tulis tangan makna pegon.</span>
            </div>
          </label>

          {/* Jenggotan Lines count selection */}
          {settings.showJenggotanLines && (
            <div className="pl-6 pt-1">
              <label className="block text-[9px] uppercase font-bold text-stone-500 mb-1">Jumlah Baris Bantu per Baris Arab</label>
              <div className="flex gap-2">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleUpdate('jenggotanCount', num)}
                    className={`px-3 py-1 text-xs rounded border transition-all cursor-pointer ${
                      settings.jenggotanCount === num 
                        ? 'bg-red-700 text-white border-red-700 font-bold' 
                        : 'bg-white text-stone-700 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {num} Baris
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
