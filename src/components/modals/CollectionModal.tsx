
import { useAppState, useAppActions } from '../../context/AppContext';
import { FIGURE_SETS } from '../../data/figures';

export function CollectionModal() {
  const { state } = useAppState();
  const { toggleCollection, toggleFigureDetail } = useAppActions();

  if (!state.showCollection) return null;

  const rarityTextMap = { common: 'common', rare: 'rare', secret: 'secret' };

  return (
    <div
      onClick={toggleCollection}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(74, 59, 82, 0.36)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'ffFade 0.2s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: '32px',
          width: '760px',
          maxWidth: '100%',
          maxHeight: '88vh',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(74, 59, 82, 0.28)',
          animation: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          position: 'relative',
        }}
      >
        <div className="ff-scroll" style={{ padding: '32px 34px 30px', marginTop: '6px', maxHeight: 'calc(88vh - 12px)', overflowY: 'auto', overflowX: 'hidden' }}>
          <button
            onClick={toggleCollection}
            style={{
              position: 'absolute',
              top: '18px',
              right: '20px',
              border: 'none',
              cursor: 'pointer',
              background: '#F4EEF8',
              color: '#9B84A6',
              width: '34px',
              height: '34px',
              borderRadius: '12px',
              fontSize: '17px',
              fontWeight: 900,
              zIndex: 10,
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#C6AECD' }}>
                my collection
              </div>
              <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '28px' }}>
                all your figures
              </div>
            </div>
          </div>

          {FIGURE_SETS.map(set => {
            const ownedCount = set.figures.filter(
              f => (state.collection[f.id] || 0) > 0
            ).length;

            return (
              <div key={set.id} style={{ marginTop: '26px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '10px' }}>
                  <div>
                    <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '19px', color: '#4A3B52' }}>
                      {set.name}
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#B29BB8', marginTop: '1px' }}>
                      {set.series}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color: '#8C74A0', background: '#F4EEF8', borderRadius: '14px', padding: '5px 12px', fontSize: '13px', flex: 'none' }}>
                    {ownedCount}/{set.figures.length}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '14px', marginTop: '12px' }}>
                  {set.figures.map(f => {
                    const count = state.collection[f.id] || 0;
                    const isOwned = count > 0;
                    const isSecret = f.rarity === 'secret';

                    return (
                      <button
                        key={f.id}
                        onClick={() => isOwned && toggleFigureDetail(f.id)}
                        style={{
                          border: `2px solid ${isOwned ? (isSecret ? '#FFE3A8' : '#F0E7F5') : '#EFE9F3'}`,
                          cursor: isOwned ? 'pointer' : 'default',
                          position: 'relative',
                          background: isOwned ? (isSecret ? '#FFF6E4' : '#FCFAFE') : '#F7F4FA',
                          borderRadius: '22px',
                          padding: '20px 10px 14px',
                          textAlign: 'center',
                          boxShadow: '0 8px 18px rgba(74, 59, 82, 0.06)',
                          transition: 'transform 0.14s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (isOwned) e.currentTarget.style.transform = 'translateY(-3px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = '';
                        }}
                      >
                        {isSecret && isOwned && (
                          <div style={{ position: 'absolute', top: '8px', left: 0, right: 0, fontSize: '10px', fontWeight: 900, letterSpacing: '1px', color: '#B8763A' }}>
                            SECRET
                          </div>
                        )}

                        {isOwned ? (
                          <div style={{ width: '60px', height: '60px', overflow: 'hidden', margin: '0 auto' }}>
                            <img
                              src={f.img}
                              alt={f.name}
                              style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
                            />
                          </div>
                        ) : (
                          <div style={{ fontSize: '52px', lineHeight: 1, filter: 'grayscale(1)', opacity: 0.28 }}>
                            ❔
                          </div>
                        )}

                        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 500, fontSize: '14px', marginTop: '9px', color: isOwned ? '#4A3B52' : '#C3B4CB' }}>
                          {isOwned ? f.name : (isSecret ? '??? secret' : 'not found yet')}
                        </div>

                        {isSecret && isOwned && (
                          <div style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.6px', textTransform: 'uppercase', marginTop: '3px', color: '#D19A3D' }}>
                            {rarityTextMap[f.rarity]}
                          </div>
                        )}

                        {count > 1 && (
                          <div style={{ position: 'absolute', bottom: '9px', right: '11px', background: '#fff', borderRadius: '12px', padding: '2px 8px', fontWeight: 900, fontSize: '11px', color: '#8C74A0', boxShadow: '0 3px 8px rgba(74, 59, 82, 0.12)' }}>
                            ×{count}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
