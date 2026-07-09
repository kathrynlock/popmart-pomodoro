import { useContext } from 'react';
import { DragContext } from '../context/DragContext';

export function DragGhost() {
  const ctx = useContext(DragContext);
  if (!ctx || !ctx.dragGhost.imageUrl) return null;

  const { imageUrl, x, y } = ctx.dragGhost;

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        width: '64px',
        height: '64px',
        transform: 'translate(-50%, -50%) scale(1.18)',
        pointerEvents: 'none',
        zIndex: 90,
        filter: 'drop-shadow(0 12px 16px rgba(74, 59, 82, 0.4))',
        overflow: 'hidden',
      }}
    >
      <img
        alt="dragging figure"
        src={imageUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transform: 'scale(1.35)',
        }}
      />
    </div>
  );
}
