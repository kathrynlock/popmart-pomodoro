import { useState } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCorners, DragOverlay } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useAppState, useAppActions } from '../context/AppContext';
import { useFigures } from '../hooks/useFigures';
import { ShelfItem } from './ShelfItem';

export function Shelf() {
  const { state } = useAppState();
  const { toggleCollection, reorderShelf } = useAppActions();
  const { findFigure } = useFigures();
  const [draggedFigId, setDraggedFigId] = useState<string | null>(null);
  const [draggedFigData, setDraggedFigData] = useState<any>(null);

  const shelfFigures = state.displayed
    .filter(id => (state.collection[id] || 0) > 0)
    .map(id => {
      const found = findFigure(id);
      if (!found) return null;
      const count = state.collection[id] || 0;
      return { ...found.fig, count };
    })
    .filter((f): f is any => f !== null);

  const isEmpty = shelfFigures.length === 0;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 0,
      },
    })
  );

  const handleDragStart = (event: any) => {
    const figIdStr = event.active.id as string;
    if (figIdStr.startsWith('shelf-')) {
      const figId = figIdStr.replace('shelf-', '');
      const fig = shelfFigures.find(f => f.id === figId);
      setDraggedFigId(figId);
      setDraggedFigData(fig);
    }
  };

  const handleDragMove = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const overIdStr = over.id as string;
    const figIdStr = active.id as string;

    if (!figIdStr.startsWith('shelf-')) return;

    const figId = figIdStr.replace('shelf-', '');

    if (overIdStr.startsWith('shelf-')) {
      const overFigId = overIdStr.replace('shelf-', '');
      if (figId === overFigId) return;

      const fullOrder = shelfFigures.map(f => `shelf-${f.id}`);
      const fromIndex = fullOrder.findIndex(id => id === figIdStr);
      const toIndex = fullOrder.findIndex(id => id === overIdStr);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        const reordered = [...fullOrder];
        const [movedId] = reordered.splice(fromIndex, 1);
        reordered.splice(toIndex, 0, movedId);

        const newOrder = reordered.map(id => id.replace('shelf-', ''));
        reorderShelf(newOrder);
      }
    }
  };

  const handleDragEnd = () => {
    setDraggedFigId(null);
    setDraggedFigData(null);
  };

  return (
    <section style={{ position: 'relative', zIndex: 5, marginTop: 'auto', width: '100%', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '100%', padding: '14px 46px 0', background: 'linear-gradient(180deg, #FDF0DE, #F9E7CE)', boxShadow: '0 -10px 30px rgba(74, 59, 82, 0.06)', borderTop: '3px solid #FFFEFB' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#CBA478' }}>
            my shelf
          </div>
          <button
            onClick={toggleCollection}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: 'transparent',
              color: '#B47F4C',
              fontWeight: 900,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#E09A5C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#B47F4C')}
          >
            view my collection <span>→</span>
          </button>
        </div>

        {isEmpty ? (
          <div style={{ textAlign: 'center', padding: '16px 6px 24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#B7936A' }}>
              your shelf is empty — pick a few favorites from your collection to display
            </div>
            <button
              onClick={toggleCollection}
              style={{
                marginTop: '12px',
                cursor: 'pointer',
                border: 'none',
                background: '#fff',
                color: '#B47F4C',
                borderRadius: '14px',
                padding: '9px 18px',
                fontWeight: 900,
                fontSize: '13px',
                boxShadow: '0 4px 10px rgba(74, 59, 82, 0.1)',
              }}
            >
              choose figures
            </button>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={shelfFigures.map(f => `shelf-${f.id}`)} strategy={horizontalListSortingStrategy}>
              <div
                style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', padding: '6px 6px 6px', position: 'relative' }}
              >
                {shelfFigures.map(fig => (
                  <ShelfItem
                    key={fig.id}
                    figure={fig}
                    isDragging={draggedFigId === fig.id}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {draggedFigData ? (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    padding: '0 6px',
                    opacity: 0.95,
                  }}
                >
                  <div style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 9px 6px rgba(74,59,82,.22))' }}>
                    <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                      <img
                        src={draggedFigData.img}
                        alt={draggedFigData.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#9A7550', maxWidth: '88px', textAlign: 'center', lineHeight: '1.1', height: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {draggedFigData.name}
                  </div>
                  {draggedFigData.count > 1 && (
                    <span style={{ position: 'absolute', top: '-2px', right: 0, background: '#fff', borderRadius: '9px', padding: '0 5px', fontWeight: 900, fontSize: '10px', color: '#8C74A0', boxShadow: '0 2px 6px rgba(74, 59, 82, 0.16)' }}>
                      ×{draggedFigData.count}
                    </span>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
      <div style={{ width: '100%', height: '22px', background: 'linear-gradient(180deg, #ECD4B2, #DFC095)', boxShadow: 'inset 0 4px 6px rgba(255, 255, 255, 0.55), 0 6px 16px rgba(74, 59, 82, 0.10)' }} />
    </section>
  );
}
