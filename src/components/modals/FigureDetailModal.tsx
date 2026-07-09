import { useAppState, useAppActions } from '../../context/AppContext';
import { useFigures } from '../../hooks/useFigures';

export function FigureDetailModal() {
  const { state } = useAppState();
  const { toggleFigureDetail, toggleShelf } = useAppActions();
  const { findFigure } = useFigures();

  if (!state.showFigureDetail || !state.selectedFigureId) return null;

  const figData = findFigure(state.selectedFigureId);
  if (!figData) return null;

  const { fig, set } = figData;
  const count = state.collection[fig.id] || 0;
  const inShelf = state.displayed.includes(fig.id);
  const isSecret = fig.rarity === 'secret';

  const setmates = set.figures
    .filter(x => x.id !== fig.id)
    .map(x => {
      const c = state.collection[x.id] || 0;
      const xOwned = c > 0;
      return {
        id: x.id,
        name: x.name,
        img: x.img,
        owned: xOwned,
        count: c,
        color: x.color,
      };
    });

  return (
    <div
      onClick={() => toggleFigureDetail()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 75,
        background: 'rgba(74, 59, 82, 0.4)',
        backdropFilter: 'blur(4px)',
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
          borderRadius: '30px',
          width: '420px',
          maxWidth: '100%',
          maxHeight: '88vh',
          overflow: 'hidden',
          boxShadow: '0 30px 70px rgba(74, 59, 82, 0.3)',
          animation: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <button
          onClick={() => toggleFigureDetail()}
          style={{
            position: 'absolute',
            top: '16px',
            right: '18px',
            zIndex: 2,
            border: 'none',
            cursor: 'pointer',
            background: 'rgba(255, 255, 255, 0.85)',
            color: '#9B84A6',
            width: '34px',
            height: '34px',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: 900,
          }}
        >
          ×
        </button>

        <div
          style={{
            width: '100%',
            aspectRatio: '1/1',
            background: 'linear-gradient(180deg, #FDF6EC, #FBEFDD)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <img
            src={fig.img}
            alt={fig.name}
            style={{
              width: '78%',
              height: '78%',
              objectFit: 'contain',
              transform: 'scale(1.35)',
              filter: 'drop-shadow(0 14px 18px rgba(74, 59, 82, 0.16))',
            }}
          />
        </div>

        <div
          style={{
            padding: '22px 32px 28px',
            overflowY: 'auto',
            flex: 1,
            maxHeight: 'calc(88vh - 400px)',
          }}
        >
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '24px', marginTop: '2px' }}>
            {fig.name}
          </div>

          {isSecret && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '8px',
                padding: '5px 14px',
                borderRadius: '16px',
                background: '#F4EEF8',
                color: '#8C74A0',
                fontWeight: 900,
                fontSize: '11px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {fig.rarity}
            </div>
          )}

          <div style={{ fontSize: '13px', color: '#A695AE', fontWeight: 700, marginTop: '12px' }}>
            from <span style={{ color: '#8C74A0', fontWeight: 900 }}>{set.name}</span> · {set.series}
          </div>

          {count > 0 && (
            <>
              <div style={{ fontSize: '13px', color: '#9BAF7A', fontWeight: 800, marginTop: '4px' }}>
                you have {count}
              </div>
              <button
                onClick={() => toggleShelf(fig.id)}
                style={{
                  marginTop: '18px',
                  border: 'none',
                  cursor: 'pointer',
                  background: inShelf ? '#F4EEF8' : '#F5A0C4',
                  color: inShelf ? '#9B84A6' : '#fff',
                  borderRadius: '16px',
                  padding: '12px 22px',
                  fontWeight: 900,
                  fontSize: '14px',
                  transition: 'all 0.2s ease',
                }}
              >
                {inShelf ? 'remove from shelf' : 'add to shelf'}
              </button>
            </>
          )}

          {setmates.length > 0 && (
            <div style={{ marginTop: '22px', borderTop: '2px dashed #F0E8F4', paddingTop: '16px' }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 900,
                  letterSpacing: '1.4px',
                  textTransform: 'uppercase',
                  color: '#C6AECD',
                  textAlign: 'center',
                }}
              >
                also in {set.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '12px', justifyContent: 'center' }}>
                {setmates.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => {
                      if (m.owned) {
                        toggleFigureDetail(m.id);
                      }
                    }}
                    style={{
                      border: 'none',
                      cursor: m.owned ? 'pointer' : 'default',
                      background: m.owned ? '#FCFAFE' : '#F4F0F8',
                      borderRadius: '16px',
                      padding: '10px 8px',
                      width: '74px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '4px',
                      opacity: m.owned ? 1 : 0.55,
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (m.owned) e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                    }}
                  >
                    {m.owned ? (
                      <div style={{ width: '34px', height: '34px', overflow: 'hidden' }}>
                        <img
                          src={m.img}
                          alt={m.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            transform: 'scale(1.35)',
                            filter: m.owned ? 'none' : 'grayscale(1)',
                          }}
                        />
                      </div>
                    ) : (
                      <span style={{ fontSize: '26px', filter: 'grayscale(1)', opacity: 0.35 }}>❔</span>
                    )}
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#8C74A0', textAlign: 'center', lineHeight: 1.15 }}>
                      {m.owned ? m.name : '???'}
                    </span>
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
