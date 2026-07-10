import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useRef } from 'react';
import { useAppActions } from '../context/AppContext';

interface ShelfItemProps {
  figure: any;
  isDragging: boolean;
}

export function ShelfItem({ figure, isDragging }: ShelfItemProps) {
  const { toggleFigureDetail } = useAppActions();
  const [isHovered, setIsHovered] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number } | null>(null);
  const wasClickRef = useRef(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: `shelf-${figure.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition ? `${transition}, opacity 200ms ease` : 'transform 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 200ms ease',
    opacity: isDragging ? 0 : 1,
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = { startX: e.clientX, startY: e.clientY };
    wasClickRef.current = true;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (dragRef.current && wasClickRef.current && !isSortableDragging) {
      const dx = Math.abs(e.clientX - dragRef.current.startX);
      const dy = Math.abs(e.clientY - dragRef.current.startY);

      // If it was a click (minimal movement), open the detail view
      if (dx < 4 && dy < 4) {
        toggleFigureDetail(figure.id);
      }
    }
    dragRef.current = null;
    wasClickRef.current = false;
  };

  return (
    <button
      ref={setNodeRef}
      style={{
        position: 'relative',
        border: 'none',
        background: 'transparent',
        cursor: isSortableDragging ? 'grabbing' : 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2px',
        padding: '0 6px',
        touchAction: 'none',
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => !isSortableDragging && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...attributes}
      {...listeners}
    >
      <div
        style={{
          width: '80px',
          height: '80px',
          filter: 'drop-shadow(0 9px 6px rgba(74,59,82,.22))',
          transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'transform 0.2s ease',
        }}
      >
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <img
            src={figure.img}
            alt={figure.name}
            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
          />
        </div>
      </div>
      <div style={{ fontSize: '11px', fontWeight: 800, color: '#9A7550', maxWidth: '88px', textAlign: 'center', lineHeight: '1.1', height: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {figure.name}
      </div>
      {figure.count > 1 && (
        <span style={{ position: 'absolute', top: '-2px', right: 0, background: '#fff', borderRadius: '9px', padding: '0 5px', fontWeight: 900, fontSize: '10px', color: '#8C74A0', boxShadow: '0 2px 6px rgba(74, 59, 82, 0.16)' }}>
          ×{figure.count}
        </span>
      )}
    </button>
  );
}
