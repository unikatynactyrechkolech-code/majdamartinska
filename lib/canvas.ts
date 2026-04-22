// ============================================================
// Sdílené typy + parser canvas dokumentu
// (oddělené, aby šlo importovat ze server komponent)
// ============================================================

export const CANVAS_MARKER = '<!--MAJDA_CANVAS-->';

export type Align = 'left' | 'center' | 'right';

export interface TextBlock {
  id: string;
  type: 'text';
  x: number; y: number; w: number; h: number;
  text: string;
  fontSize: number;
  color: string;
  bg: string;
  align: Align;
  fontFamily: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  lineHeight: number;
  padding: number;
  z: number;
}

export interface ImageBlock {
  id: string;
  type: 'image';
  x: number; y: number; w: number; h: number;
  src: string;
  alt: string;
  fit: 'cover' | 'contain';
  radius: number;
  z: number;
}

export type CanvasBlock = TextBlock | ImageBlock;

export interface CanvasDoc {
  version: 1;
  width: number;
  height: number;
  bg: string;
  blocks: CanvasBlock[];
}

export function parseCanvas(content: string | null | undefined): CanvasDoc | null {
  if (!content) return null;
  if (!content.startsWith(CANVAS_MARKER)) return null;
  try {
    const json = content.slice(CANVAS_MARKER.length);
    const doc = JSON.parse(json) as CanvasDoc;
    if (doc.version !== 1 || !Array.isArray(doc.blocks)) return null;
    return doc;
  } catch {
    return null;
  }
}

export function serializeCanvas(doc: CanvasDoc): string {
  return CANVAS_MARKER + JSON.stringify(doc);
}
