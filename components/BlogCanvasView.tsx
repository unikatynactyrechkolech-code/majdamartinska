'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CanvasDoc, CanvasBlock } from '@/lib/canvas';

// ============================================================
// BlogCanvasView — veřejné renderování canvas článku
// Škáluje canvas šířky 960 do dostupné šířky kontejneru.
// ============================================================

interface Props {
  doc: CanvasDoc;
}

export function BlogCanvasView({ doc }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const w = wrapRef.current?.clientWidth || doc.width;
      setScale(Math.min(1, w / doc.width));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [doc.width]);

  const wrapStyle: CSSProperties = {
    width: '100%',
    height: doc.height * scale,
    overflow: 'hidden',
    position: 'relative',
  };
  const stageStyle: CSSProperties = {
    width: doc.width, height: doc.height,
    background: doc.bg,
    position: 'absolute', top: 0, left: 0,
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  return (
    <div ref={wrapRef} className="canvas-view-wrap" style={wrapStyle}>
      <div className="canvas-view-stage" style={stageStyle}>
        {doc.blocks.map((b) => (
          <BlockView key={b.id} block={b} />
        ))}
      </div>
    </div>
  );
}

function BlockView({ block }: { block: CanvasBlock }) {
  const style: CSSProperties = {
    position: 'absolute',
    left: block.x, top: block.y, width: block.w, height: block.h, zIndex: block.z,
  };
  if (block.type === 'text') {
    const ts: CSSProperties = {
      width: '100%', height: '100%',
      fontSize: block.fontSize,
      color: block.color,
      background: block.bg || 'transparent',
      textAlign: block.align,
      fontFamily: block.fontFamily || 'inherit',
      fontWeight: block.bold ? 700 : 400,
      fontStyle: block.italic ? 'italic' : 'normal',
      textDecoration: block.underline ? 'underline' : 'none',
      lineHeight: block.lineHeight,
      padding: block.padding,
      boxSizing: 'border-box',
      overflow: 'hidden',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
    };
    return <div style={style}><div style={ts}>{block.text}</div></div>;
  }
  return (
    <div style={style}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={block.src}
        alt={block.alt}
        style={{
          width: '100%', height: '100%',
          objectFit: block.fit, borderRadius: block.radius,
          display: 'block',
        }}
      />
    </div>
  );
}
