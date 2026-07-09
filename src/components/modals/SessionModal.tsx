
import { useAppState, useAppActions } from '../../context/AppContext';
import { BLIND_BOXES } from '../../data/figures';

export function SessionModal() {
  const { state } = useAppState();
  const {
    toggleSessionPopup,
    setSessionMode,
    setTimerMins,
    setPomoWork,
    setPomoBreak,
    setSessionBox,
    startSession,
    peekSession,
  } = useAppActions();

  if (!state.showSessionPopup) return null;

  const isTimerMode = state.sessionMode === 'timer';
  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  return (
    <div
      onClick={toggleSessionPopup}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(74, 59, 82, 0.32)',
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
          borderRadius: '30px',
          padding: '32px 34px',
          width: '440px',
          maxWidth: '100%',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 30px 70px rgba(74, 59, 82, 0.28)',
          animation: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '27px' }}>start a session</div>
        <div style={{ fontSize: '14px', color: '#A695AE', fontWeight: 700, marginTop: '2px' }}>pick your focus style</div>

        <div style={{ display: 'flex', gap: '6px', background: '#F4EEF8', borderRadius: '18px', padding: '5px', marginTop: '18px' }}>
          <button
            onClick={() => setSessionMode('timer')}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: '14px',
              padding: '11px',
              fontWeight: 900,
              fontSize: '14px',
              background: isTimerMode ? '#ffffff' : 'transparent',
              color: isTimerMode ? '#4A3B52' : '#A695AE',
              boxShadow: isTimerMode ? '0 4px 10px rgba(74,59,82,.12)' : 'none',
              transition: 'all 0.14s ease',
            }}
          >
            ⏱ just a timer
          </button>
          <button
            onClick={() => setSessionMode('pomodoro')}
            style={{
              flex: 1,
              border: 'none',
              cursor: 'pointer',
              borderRadius: '14px',
              padding: '11px',
              fontWeight: 900,
              fontSize: '14px',
              background: !isTimerMode ? '#ffffff' : 'transparent',
              color: !isTimerMode ? '#4A3B52' : '#A695AE',
              boxShadow: !isTimerMode ? '0 4px 10px rgba(74,59,82,.12)' : 'none',
              transition: 'all 0.14s ease',
            }}
          >
            🍅 pomodoro
          </button>
        </div>

        {isTimerMode ? (
          <div style={{ marginTop: '22px' }}>
            <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#C6AECD' }}>
              focus for
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
              <button
                onClick={() => setTimerMins(clamp(state.timerMins - 5, 5, 120))}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#F4EEF8',
                  color: '#9B84A6',
                  fontSize: '24px',
                  fontWeight: 900,
                  lineHeight: 1,
                  transition: 'transform 0.12s ease',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = '')}
              >
                –
              </button>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '52px', lineHeight: 1, color: '#4A3B52', fontVariantNumeric: 'tabular-nums', minWidth: '160px' }}>
                {String(state.timerMins).padStart(2, '0')}:00
              </div>
              <button
                onClick={() => setTimerMins(clamp(state.timerMins + 5, 5, 120))}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#FFE0BE',
                  color: '#B8763A',
                  fontSize: '24px',
                  fontWeight: 900,
                  lineHeight: 1,
                  transition: 'transform 0.12s ease',
                }}
                onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                onMouseUp={(e) => (e.currentTarget.style.transform = '')}
              >
                +
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              {[15, 25, 45, 60].map(m => (
                <button
                  key={m}
                  onClick={() => setTimerMins(m)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    background: state.timerMins === m ? '#FFDDB8' : '#F6EFF7',
                    color: '#6E5A78',
                    borderRadius: '14px',
                    padding: '8px 14px',
                    fontWeight: 900,
                    fontSize: '13px',
                    transition: 'all 0.14s ease',
                  }}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '11px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FFF8F0', border: '2px solid #FFDDB8', borderRadius: '18px', padding: '11px 14px 11px 18px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '15px', color: '#4A3B52' }}>focus</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setPomoWork(clamp(state.pomoWork - 5, 5, 90))}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#B8763A',
                    fontSize: '20px',
                    fontWeight: 900,
                    lineHeight: 1,
                    boxShadow: '0 2px 6px rgba(74,59,82,.1)',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                >
                  –
                </button>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#4A3B52', minWidth: '60px', textAlign: 'center' }}>
                  {state.pomoWork} min
                </span>
                <button
                  onClick={() => setPomoWork(clamp(state.pomoWork + 5, 5, 90))}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#B8763A',
                    fontSize: '20px',
                    fontWeight: 900,
                    lineHeight: 1,
                    boxShadow: '0 2px 6px rgba(74,59,82,.1)',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F1F8FE', border: '2px solid #D0E6F7', borderRadius: '18px', padding: '11px 14px 11px 18px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: 900, fontSize: '15px', color: '#4A3B52' }}>break</span>
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setPomoBreak(clamp(state.pomoBreak - 1, 1, 30))}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#4E86B8',
                    fontSize: '20px',
                    fontWeight: 900,
                    lineHeight: 1,
                    boxShadow: '0 2px 6px rgba(74,59,82,.1)',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                >
                  –
                </button>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#4A3B52', minWidth: '60px', textAlign: 'center' }}>
                  {state.pomoBreak} min
                </span>
                <button
                  onClick={() => setPomoBreak(clamp(state.pomoBreak + 1, 1, 30))}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    background: '#fff',
                    color: '#4E86B8',
                    fontSize: '20px',
                    fontWeight: 900,
                    lineHeight: 1,
                    boxShadow: '0 2px 6px rgba(74,59,82,.1)',
                    transition: 'transform 0.12s ease',
                  }}
                  onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
                  onMouseUp={(e) => (e.currentTarget.style.transform = '')}
                >
                  +
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                onClick={() => {
                  setPomoWork(25);
                  setPomoBreak(5);
                }}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  background: '#F4EEF8',
                  color: '#6E5A78',
                  borderRadius: '14px',
                  padding: '7px 14px',
                  fontWeight: 900,
                  fontSize: '13px',
                  transition: 'all 0.14s ease',
                }}
              >
                25 · 5
              </button>
              <button
                onClick={() => {
                  setPomoWork(50);
                  setPomoBreak(10);
                }}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  background: '#F4EEF8',
                  color: '#6E5A78',
                  borderRadius: '14px',
                  padding: '7px 14px',
                  fontWeight: 900,
                  fontSize: '13px',
                  transition: 'all 0.14s ease',
                }}
              >
                50 · 10
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: '22px', borderTop: '2px dashed #F0E8F4', paddingTop: '18px' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#C6AECD' }}>
            choose your reward box
          </div>
          <div style={{ fontSize: '12px', color: '#B7A6BE', fontWeight: 700, marginTop: '3px' }}>
            you'll open it when you finish — no takebacks!
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
            {BLIND_BOXES.map((box, i) => (
              <button
                key={i}
                onClick={() => setSessionBox(i)}
                style={{
                  border: `3px solid ${state.sessionBox === i ? '#F5A0C4' : 'transparent'}`,
                  cursor: 'pointer',
                  background: 'transparent',
                  borderRadius: '16px',
                  padding: '4px',
                  transition: 'transform 0.14s ease',
                  transform: state.sessionBox === i ? 'translateY(-4px)' : 'none',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '40px',
                    borderRadius: '11px',
                    background: box.color,
                    boxShadow: '0 4px 10px rgba(74,59,82,.14)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: 0,
                      bottom: 0,
                      width: '8px',
                      marginLeft: '-4px',
                      background: 'rgba(255,255,255,.65)',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      right: 0,
                      height: '8px',
                      marginTop: '-4px',
                      background: 'rgba(255,255,255,.65)',
                    }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={startSession}
          style={{
            marginTop: '22px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: '#F5A0C4',
            color: '#fff',
            borderRadius: '18px',
            padding: '16px',
            fontWeight: 900,
            fontSize: '17px',
            boxShadow: '0 7px 0 #E27FAB',
            transition: 'all 0.12s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(4px)';
            e.currentTarget.style.boxShadow = '0 3px 0 #E27FAB';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 7px 0 #E27FAB';
          }}
        >
          start · {isTimerMode ? `${state.timerMins} min` : `${state.pomoWork} + ${state.pomoBreak} min`}
        </button>

        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <button
            onClick={peekSession}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#C3B1CB',
              fontWeight: 800,
              fontSize: '13px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#9B84A6')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#C3B1CB')}
          >
            or try a 10-second peek
          </button>
        </div>

        <div style={{ marginTop: '8px', textAlign: 'center' }}>
          <button
            onClick={toggleSessionPopup}
            style={{
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: '#B7A6BE',
              fontWeight: 800,
              fontSize: '14px',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#9B84A6')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#B7A6BE')}
          >
            maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
