import { useRef, useState } from 'react';
import { useAppState, useAppActions } from '../context/AppContext';
import { useFigures } from '../hooks/useFigures';

export function Shelf() {
  const { state } = useAppState();
  const { toggleCollection, toggleFigureDetail, reorderShelf } = useAppActions();
  const { findFigure } = useFigures();
  const shelfContainerRef = useRef<HTMLDivElement>(null);
  const shelfRefsMap = useRef<Map<string, HTMLButtonElement>>(new Map());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ id: string; startX: number; startY: number; moved: boolean } | null>(null);
  const justDraggedRef = useRef(false);
  const moveHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);
  const upHandlerRef = useRef<((e: PointerEvent) => void) | null>(null);

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

  const slideReorder = (oldOrder: string[], newOrder: string[]) => {
    // Capture old positions BEFORE setState
    const oldRects = new Map<string, DOMRect>();
    oldOrder.forEach(id => {
      const el = shelfRefsMap.current.get(id);
      if (el) oldRects.set(id, el.getBoundingClientRect());
    });

    // Update order
    reorderShelf(newOrder);

    // Animate after state update
    setTimeout(() => {
      newOrder.forEach(id => {
        if (id === dragRef.current?.id) return; // Skip dragging item

        const el = shelfRefsMap.current.get(id);
        const oldRect = oldRects.get(id);
        if (!el || !oldRect) return;

        const newRect = el.getBoundingClientRect();
        const dx = oldRect.left - newRect.left;
        const dy = oldRect.top - newRect.top;

        if (dx !== 0 || dy !== 0) {
          el.style.transition = 'none';
          el.style.transform = `translate(${dx}px, ${dy}px)`;

          requestAnimationFrame(() => {
            el.style.transition = 'transform 0.22s cubic-bezier(0.2, 0.8, 0.3, 1)';
            el.style.transform = '';
          });
        }
      });
    }, 0);
  };

  const handlePointerDown = (figId: string, e: React.PointerEvent<HTMLButtonElement>) => {
    dragRef.current = {
      id: figId,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
    };
    setDraggingId(figId);
    setGhostPos(null);
    justDraggedRef.current = false;

    moveHandlerRef.current = (moveEvent: PointerEvent) => {
      if (!dragRef.current) return;

      const dx = moveEvent.clientX - dragRef.current.startX;
      const dy = moveEvent.clientY - dragRef.current.startY;

      if (Math.abs(dx) + Math.abs(dy) > 6) {
        dragRef.current.moved = true;
        justDraggedRef.current = true;
        setGhostPos({ x: moveEvent.clientX, y: moveEvent.clientY });
      }

      if (dragRef.current.moved) {
        setGhostPos({ x: moveEvent.clientX, y: moveEvent.clientY });

        if (shelfContainerRef.current) {
          const container = shelfContainerRef.current;
          const crect = container.getBoundingClientRect();

          if (moveEvent.clientY < crect.top - 50 || moveEvent.clientY > crect.bottom + 50) return;

          const fullOrder = shelfFigures.map(f => f.id);
          const others = fullOrder.filter(id => id !== dragRef.current!.id);
          let insertPos = others.length;

          for (let i = 0; i < others.length; i++) {
            const el = shelfRefsMap.current.get(others[i]);
            if (!el) continue;
            const r = el.getBoundingClientRect();
            const centerX = (r.left + r.right) / 2;
            if (moveEvent.clientX < centerX) {
              insertPos = i;
              break;
            }
          }

          const newOrder = others.slice();
          newOrder.splice(insertPos, 0, dragRef.current.id);
          const changed = newOrder.some((id, i) => id !== fullOrder[i]);

          if (changed) {
            slideReorder(fullOrder, newOrder);
          }
        }
      }
    };

    upHandlerRef.current = () => {
      if (dragRef.current && !dragRef.current.moved) {
        // It was a click, not a drag
        toggleFigureDetail(figId);
      }

      if (moveHandlerRef.current) {
        window.removeEventListener('pointermove', moveHandlerRef.current);
      }
      if (upHandlerRef.current) {
        window.removeEventListener('pointerup', upHandlerRef.current);
      }

      dragRef.current = null;
      setDraggingId(null);
      setGhostPos(null);
    };

    window.addEventListener('pointermove', moveHandlerRef.current);
    window.addEventListener('pointerup', upHandlerRef.current);
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
          <>
            {ghostPos && draggingId && (
              <div
                style={{
                  position: 'fixed',
                  left: `${ghostPos.x - 45}px`,
                  top: `${ghostPos.y - 50}px`,
                  width: '90px',
                  pointerEvents: 'none',
                  zIndex: 50,
                  opacity: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  padding: '0 6px',
                }}
              >
                {shelfFigures.map(fig => {
                  if (fig.id !== draggingId) return null;
                  return (
                    <div key={fig.id} style={{ width: '100%' }}>
                      <div style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 9px 6px rgba(74,59,82,.22))' }}>
                        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                          <img
                            src={fig.img}
                            alt={fig.name}
                            style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
                          />
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 800, color: '#9A7550', maxWidth: '88px', textAlign: 'center', lineHeight: '1.1', height: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {fig?.name}
                      </div>
                      {fig && fig.count > 1 && (
                        <span style={{ position: 'absolute', top: '-2px', right: 0, background: '#fff', borderRadius: '9px', padding: '0 5px', fontWeight: 900, fontSize: '10px', color: '#8C74A0', boxShadow: '0 2px 6px rgba(74, 59, 82, 0.16)' }}>
                          ×{fig.count}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            <div
              ref={shelfContainerRef}
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', flexWrap: 'wrap', gap: '6px', padding: '6px 6px 6px', position: 'relative' }}
            >
              {(shelfFigures as any[]).map(fig => {
                const isDragging = draggingId === fig.id;

                return (
                  <button
                    key={fig.id}
                    ref={(el) => {
                      if (el) shelfRefsMap.current.set(fig.id, el);
                    }}
                    onPointerDown={(e) => handlePointerDown(fig.id, e)}
                    style={{
                      position: 'relative',
                      border: 'none',
                      background: 'transparent',
                      cursor: draggingId === fig.id ? 'grabbing' : 'grab',
                      display: isDragging ? 'none' : 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '2px',
                      padding: '0 6px',
                      touchAction: 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (draggingId !== fig.id) {
                        e.currentTarget.style.transform = 'translateY(-6px)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                    }}
                  >
                    <div style={{ width: '80px', height: '80px', filter: 'drop-shadow(0 9px 6px rgba(74,59,82,.22))' }}>
                      <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
                        <img
                          src={fig.img}
                          alt={fig.name}
                          style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
                        />
                      </div>
                    </div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#9A7550', maxWidth: '88px', textAlign: 'center', lineHeight: '1.1', height: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fig?.name}
                    </div>
                    {fig && fig.count > 1 && (
                      <span style={{ position: 'absolute', top: '-2px', right: 0, background: '#fff', borderRadius: '9px', padding: '0 5px', fontWeight: 900, fontSize: '10px', color: '#8C74A0', boxShadow: '0 2px 6px rgba(74, 59, 82, 0.16)' }}>
                        ×{fig.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
      <div style={{ width: '100%', height: '22px', background: 'linear-gradient(180deg, #ECD4B2, #DFC095)', boxShadow: 'inset 0 4px 6px rgba(255, 255, 255, 0.55), 0 6px 16px rgba(74, 59, 82, 0.10)' }} />
    </section>
  );
}
