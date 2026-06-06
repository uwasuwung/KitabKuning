import React, { useState } from 'react';
import { LayoutSettings, KitabPreset } from '../types';
import { FileCode, Clipboard, Check, Info, Download, BookOpen } from 'lucide-react';

interface CodeExporterProps {
  settings: LayoutSettings;
  preset: KitabPreset;
}

export default function CodeExporter({ settings, preset }: CodeExporterProps) {
  const [copied, setCopied] = useState<'html' | 'css' | null>(null);

  // Get border color value based on settings
  const getSelectedColorHex = () => {
    switch (settings.borderColor) {
      case 'red-brown': return '#b91c1c';
      case 'gold': return '#d97706';
      case 'charcoal': return '#3f3f46';
      default: return settings.borderColor;
    }
  };

  // Get paper hex values based on settings
  const getSelectedPaperHex = () => {
    switch (settings.paperTexture) {
      case 'traditional-yellow': return '#fcf6e5';
      case 'aged-parchment': return '#f3ead3';
      case 'cream-classic': return '#faf6eb';
      case 'clean-white': return '#ffffff';
      default: return '#fcf6e5';
    }
  };

  const cssCode = `/* 
  ==============================================================
  STANDAR CSS TEMPLATE - ARSITEKTUR KITAB KUNING NUSANTARA
  Tipe Ukuran: Folio (F4) - 215.9mm x 330.2mm
  Didesain untuk: Cetakan Fisik, E-Book Klasik, & Web Reader
  ==============================================================
*/

/* 1. Pengaturan Ukuran Cetak Folio (F4) Standar */
@page {
  size: 215.9mm 330.2mm; /* Ukuran Folio / F4 */
  margin: 15mm; /* Batas potong aman */
}

/* 2. Variabel Tema Kitab Kuning */
:root {
  --kitab-paper-bg: ${getSelectedPaperHex()};
  --kitab-ink-primary: #1c1917;
  --kitab-border-color: ${getSelectedColorHex()};
  --kitab-arabic-font: ${settings.matanFont};
  --kitab-syarah-font: ${settings.syarahFont};
  
  /* Dimensi */
  --kitab-border-thickness: ${settings.borderThickness}px;
  --kitab-page-padding: ${settings.pagePadding}px;
  --matan-font-size: ${settings.matanFontSize}px;
  --matan-line-height: ${settings.matanLineHeight};
  --syarah-font-size: ${settings.syarahFontSize}px;
  --syarah-line-height: ${settings.syarahLineHeight};
}

/* 3. Base Style & Lembaran Folio */
.kitab-folio-page {
  width: 215.9mm;
  height: 330.2mm;
  padding: var(--kitab-page-padding);
  background-color: var(--kitab-paper-bg);
  color: var(--kitab-ink-primary);
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Tambahan pola tekstur serat kertas lawas */
.kitab-folio-page::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.15;
  background-image: radial-gradient(#b4a06e 1px, transparent 0);
  background-size: 14px 14px;
}

/* 4. Bingkai Luar Tradisional (Alur / Bingkai Kitab) */
.kitab-border-frame {
  position: absolute;
  inset: 22px;
  border: var(--kitab-border-thickness) ${settings.borderPattern === 'double-red' || settings.borderPattern === 'arabesque-gold' ? 'double' : 'solid'} var(--kitab-border-color);
  padding: 16px;
  display: flex;
  flex-direction: column;
  pointer-events: none;
}

/* Sudut Ornamen Merah Bata */
.kitab-border-frame::after {
  content: "";
  position: absolute;
  top: 6px; left: 6px; right: 6px; bottom: 6px;
  border: 1px solid var(--kitab-border-color);
  opacity: 0.4;
}

/* 5. Komponen Teks Utama (Matan) & Penjelasan (Syarah) */
.matan-text {
  font-family: var(--kitab-arabic-font);
  font-size: var(--matan-font-size);
  line-height: var(--matan-line-height);
  color: ${settings.matanColor};
  direction: rtl;
  text-align: right;
  font-weight: bold;
}

.syarah-text {
  font-family: var(--kitab-syarah-font);
  font-size: var(--syarah-font-size);
  line-height: var(--syarah-line-height);
  color: ${settings.syarahColor};
  direction: ${settings.isArabicRTL ? 'rtl' : 'ltr'};
  text-align: justify;
}

/* 6. Atribut Tambahan: Garis Renggang Tulis Makna Jenggotan */
.jenggotan-line-guide {
  width: 100%;
  border-bottom: 1px dashed rgba(185, 28, 28, 0.25);
  margin-top: 1.5em;
  height: 0;
}

/* 7. Pengaturan Halaman Metadata Marginalia */
.kitab-marginalia {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  font-family: system-ui, sans-serif;
  color: var(--kitab-border-color);
  border-bottom: 1px solid rgba(185, 28, 28, 0.15);
  padding-bottom: 6px;
  margin-bottom: 12px;
}

/* Koreksi cetak untuk printer */
@media print {
  body {
    background: transparent;
  }
  .kitab-folio-page {
    box-shadow: none;
    page-break-after: always;
  }
}`;

  const htmlCode = `<!-- 
  ==============================================================
  DUMMY STRUKTUR HTML - STANDAR KITAB KUNING FOLIO (F4) 
  Sesuai dengan Aturan Bingkai Klasik & Spasi Matan/Syarah
  ==============================================================
-->
<div class="kitab-folio-page">
  <!-- Bingkai Ornamen Klasik -->
  <div class="kitab-border-frame"></div>
  
  <div style="position: relative; z-index: 10; display: flex; flex-direction: column; height: 100%;">
    
    <!-- Bagian Kolofon & Identitas Atas (Marginalia) -->
    <div class="kitab-marginalia">
      <span>Kategori: ${preset.category}</span>
      <span style="font-size: 14px; font-weight: bold;">${preset.title.split('(')[0].trim()}</span>
      <span>Halaman 1</span>
    </div>

    <!-- Judul Bab / Fasal -->
    <div style="text-align: center; margin-bottom: 16px;">
      <h2 style="font-family: ${settings.matanFont}; margin: 0; color: ${getSelectedColorHex()};">
        ${preset.pages[0]?.chapterName || 'FASAL / BAB'}
      </h2>
    </div>

    <!-- TATA LETAK: ${settings.layoutStyle.toUpperCase()} -->
    ${settings.layoutStyle === 'center-frame' ? `<!-- Gaya Kotak Matan Tengah dikelilingi Syarah -->
    <div style="display: flex; flex-direction: column; gap: 20px; flex: 1;">
      
      <!-- Box Block Matan Utama -->
      <div style="border: 2px dashed rgba(185,28,28,0.3); padding: 15px; background: rgba(0,0,0,0.01); border-radius: 4px;">
        <div class="matan-text">
          ${preset.pages[0]?.matan || 'Teks Matan Arab'}
        </div>
      </div>

      <!-- Ruang Syarah Komentar -->
      <div style="flex: 1;">
        <span style="font-size: 10px; font-weight: bold; color: ${getSelectedColorHex()}; tracking: 1px; display: block; margin-bottom: 8px;">SYARAH (شرح)</span>
        <div class="syarah-text">
          ${preset.pages[0]?.syarah || 'Teks Syarah Penjelas'}
        </div>
      </div>
    </div>` : ''}

    ${settings.layoutStyle === 'dual-column' ? `<!-- Gaya Samping Samping Dua Kolom -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; flex: 1;">
      <!-- Kolom Syarah (Kiri) -->
      <div style="border-right: 1px solid rgba(0,0,0,0.1); padding-right: 12px;">
        <span style="font-size: 10px; font-weight: bold; color: ${getSelectedColorHex()}; display: block; margin-bottom: 8px;">KOMENTAR (شرح)</span>
        <div class="syarah-text">
          ${preset.pages[0]?.syarah || 'Syarah'}
        </div>
      </div>
      
      <!-- Kolom Matan (Kanan) -->
      <div style="padding-left: 4px;">
        <span style="font-size: 10px; font-weight: bold; text-align: right; color: ${getSelectedColorHex()}; display: block; margin-bottom: 8px;">MATAN UTAMA (متن)</span>
        <div class="matan-text">
          ${preset.pages[0]?.matan || 'Matan'}
        </div>
        
        ${settings.showJenggotanLines ? `<!-- Garis Bantu Pegon -->
        <div style="margin-top: 20px;">
          <div class="jenggotan-line-guide"></div>
          <div class="jenggotan-line-guide"></div>
        </div>` : ''}
      </div>
    </div>` : ''}

    ${settings.layoutStyle === 'top-bottom' ? `<!-- Gaya Atas Matan, Bawah Syarah dengan batas hiasan ganda -->
    <div style="display: flex; flex-direction: column; gap: 14px; flex: 1;">
      <div style="border-bottom: 2px double ${getSelectedColorHex()}; padding-bottom: 15px;">
        <div class="matan-text">
          ${preset.pages[0]?.matan || 'Matan Utama'}
        </div>
      </div>
      <div>
        <div class="syarah-text">
          ${preset.pages[0]?.syarah || 'Penjelasan Syarah'}
        </div>
      </div>
    </div>` : ''}

    ${settings.layoutStyle === 'interlinear-gloss' ? `<!-- Gaya Interlinear Renggang Guru menulis Makna Gandul -->
    <div style="display: flex; flex-direction: column; gap: 20px; flex: 1;">
      <div class="matan-text" style="font-size: 28px; line-height: 2.8;">
        <!-- Kalimat Terpotong dengan Garis di Sela -->
        ${preset.pages[0]?.matan || 'Teks Matan Utama Renggang'}
      </div>
      <!-- Garid Dotted Pembantu -->
      <div class="jenggotan-line-guide"></div>
      <div class="jenggotan-line-guide"></div>
      
      <div style="margin-top: auto; padding: 10px; background: rgba(0,0,0,0.03); font-size: 12px;">
        <strong>Terjemah Bebas:</strong> ${preset.pages[0]?.translation || 'Terjemah'}
      </div>
    </div>` : ''}

    <!-- Bagian Penutup / Colophon Nomor Halaman Bawah -->
    <div style="margin-top: auto; display: flex; justify-content: center; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.05);">
      <div style="width: 32px; height: 32px; border: 2px double ${getSelectedColorHex()}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${getSelectedColorHex()}; font-size: 13px;">
        1
      </div>
    </div>

  </div>
</div>`;

  const copyToClipboard = (type: 'html' | 'css', content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full bg-stone-900 text-stone-100 rounded-2xl border border-stone-800 shadow-xl overflow-hidden select-text">
      
      {/* Header Info */}
      <div className="bg-stone-950 p-5 border-b border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-900/40 flex items-center justify-center">
            <FileCode className="text-red-500" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Pusat Ekspor CSS & HTML Standar</h3>
            <p className="text-xs text-stone-400">Gunakan CSS ini di website atau projek cetak buku pesantren digital Anda</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-amber-500/10 border border-amber-500/20 text-amber-500 px-2 py-0.5 rounded font-mono font-bold">
            UKURAN FOLIO F4 Cetak Aman
          </span>
        </div>
      </div>

      <div className="p-5 md:p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* CSS Panel */}
        <div className="flex flex-col h-[520px] bg-stone-950/50 rounded-xl border border-stone-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span className="text-xs font-bold text-stone-300 font-mono">kitab-style-standard.css</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard('css', cssCode)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 rounded cursor-pointer transition-colors"
              >
                {copied === 'css' ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={12} />
                    <span>Salin CSS</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => handleDownloadFile('kitab-style-standard.css', cssCode)}
                className="p-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 cursor-pointer"
                title="Unduh File CSS"
              >
                <Download size={12} />
              </button>
            </div>
          </div>
          
          <pre className="flex-1 overflow-auto text-xs font-mono text-amber-100/80 p-3 bg-stone-950 rounded border border-stone-900 leading-relaxed kitab-scroll">
            <code>{cssCode}</code>
          </pre>
        </div>

        {/* HTML Panel */}
        <div className="flex flex-col h-[520px] bg-stone-950/50 rounded-xl border border-stone-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              <span className="text-xs font-bold text-stone-300 font-mono">template-kitab.html</span>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => copyToClipboard('html', htmlCode)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] bg-stone-800 hover:bg-stone-700 text-stone-200 rounded cursor-pointer transition-colors"
              >
                {copied === 'html' ? (
                  <>
                    <Check size={12} className="text-green-500" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Clipboard size={12} />
                    <span>Salin HTML</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => handleDownloadFile('template-kitab.html', htmlCode)}
                className="p-1 bg-stone-800 hover:bg-stone-700 rounded text-stone-300 cursor-pointer"
                title="Unduh File HTML"
              >
                <Download size={12} />
              </button>
            </div>
          </div>
          
          <pre className="flex-1 overflow-auto text-xs font-mono text-amber-100/80 p-3 bg-stone-950 rounded border border-stone-900 leading-relaxed kitab-scroll">
            <code>{htmlCode}</code>
          </pre>
        </div>

      </div>

      {/* Guide explaining printing instructions */}
      <div className="bg-stone-950 p-4 border-t border-stone-800 flex items-start gap-3">
        <Info className="text-red-500 shrink-0 mt-0.5" size={16} />
        <div className="text-xs text-stone-400 leading-relaxed">
          <p className="font-bold text-stone-200 mb-1">💡 Panduan Cetak Ukuran Folio (F4) Melalui Browser:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Gunakan tag penampung <code className="text-amber-200 font-mono">class="kitab-folio-page"</code> untuk setiap halaman Anda.</li>
            <li>Saat melakukan cetak (Ctrl+P atau Cmd+P), setel **Tujuan** ke Simpan sebagai PDF atau printer Anda.</li>
            <li>Ubah Ukuran Kertas di opsi lanjutan ke **Folio** atau **F4** (jika tidak ada, buat lembaran kustom ukuran 21.59 x 33.02 cm atau 8.5 x 13 inci).</li>
            <li>Setel **Margin** ke **Minimum** atau **Nol**, dan centang **Grafik Latar Belakang (Background Graphics)** agar warna kertas kuning klasiknya ikut tercetak dengan presisi.</li>
          </ul>
        </div>
      </div>

    </div>
  );
}
