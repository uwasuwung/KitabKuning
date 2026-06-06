/**
 * Types representing the styling configurations and preset data
 * for classical Kitab Kuning CSS Layout Engine.
 */

export type LayoutStyle = 'center-frame' | 'dual-column' | 'top-bottom' | 'interlinear-gloss' | 'triple-hashiyah';

export type PaperTexture = 'traditional-yellow' | 'aged-parchment' | 'cream-classic' | 'clean-white';

export type BorderPattern = 'double-red' | 'arabesque-gold' | 'ornate-accent' | 'simple-minimal' | 'none';

export interface LayoutSettings {
  paperTexture: PaperTexture;
  borderPattern: BorderPattern;
  borderColor: string;
  layoutStyle: LayoutStyle;
  
  // Matan (Core text) options
  matanFontSize: number;
  matanLineHeight: number;
  matanColor: string;
  matanFont: string;
  
  // Syarah (Commentary) & Gloss options
  syarahFontSize: number;
  syarahLineHeight: number;
  syarahColor: string;
  syarahFont: string;
  
  // Margins & Dimensions (Scaled Folio F4: 215.9mm x 330.2mm)
  pagePadding: number;
  borderThickness: number;
  showJenggotanLines: boolean; // Dotted lines under matan words for writing meanings
  jenggotanCount: number; // Number of dotted text helper lines between lines
  showFolioMetadata: boolean; // Page numbers, book header, chapter labels in margins
  
  // Language styling
  isArabicRTL: boolean;
}

export interface KitabPreset {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  category: string;
  defaultSettings: Partial<LayoutSettings>;
  pages: Array<{
    pageNumber: number;
    chapterName: string;
    matan: string;
    syarah: string;
    translation?: string;
  }>;
}
