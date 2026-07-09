import { useAppState, useAppActions } from '../context/AppContext';

interface HeaderProps {
  userName: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export function Header({ userName = 'kate' }: HeaderProps) {
  const { state } = useAppState();
  const { toggleSessionPopup, toggleTimer, resetTimer, openBlindbox } = useAppActions();
  const timer = state.timer;
  const pendingCount = state.pending.length;

  let greetingMain = `hey there, ${userName}!`;
  let greetingSub = 'what shall we get done today?';

  if (timer.active && timer.phase === 'break') {
    greetingMain = `breathe, ${userName}`;
    greetingSub = 'stretch, sip something, rest your eyes';
  } else if (timer.active) {
    const progress = timer.total ? 1 - timer.left / timer.total : 0;
    if (progress < 0.25) {
      greetingMain = `let's do this, ${userName}!`;
      greetingSub = 'settle in and find your flow';
    } else if (progress < 0.5) {
      greetingMain = 'nice and steady…';
      greetingSub = 'you\'re doing beautifully';
    } else if (progress < 0.75) {
      greetingMain = 'half way there!';
      greetingSub = 'keep going, you\'ve got this';
    } else {
      greetingMain = 'so close now!';
      greetingSub = 'a blind box is almost yours';
    }
  }

  return (
    <header style={{ position: 'relative', zIndex: 5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', padding: '24px 40px 8px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div>
          <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '40px', lineHeight: 1, color: '#4A3B52', letterSpacing: '0.3px' }}>
            {greetingMain}
          </div>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#B29BB8', letterSpacing: '0.2px', marginTop: '6px' }}>
            {greetingSub}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {pendingCount > 0 && (
          <button
            onClick={openBlindbox}
            title="open your blind boxes"
            style={{
              position: 'relative',
              cursor: 'pointer',
              border: 'none',
              width: '60px',
              height: '60px',
              borderRadius: '20px',
              background: 'linear-gradient(160deg, #FFE7C6, #FFD1A0)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '30px',
              boxShadow: '0 8px 20px rgba(255, 197, 138, 0.45)',
              animation: 'ffFloat 5s ease-in-out infinite',
              '--r': '-3deg',
            } as any}
          >
            🎁
            <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#F5A0C4', color: '#fff', fontSize: '12px', fontWeight: 900, borderRadius: '11px', minWidth: '22px', height: '22px', padding: '0 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 8px rgba(245, 160, 196, 0.5)' }}>
              ×{pendingCount}
            </span>
          </button>
        )}

        {timer.active ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#fff', borderRadius: '26px', padding: '11px 13px 11px 22px', boxShadow: '0 12px 30px rgba(74, 59, 82, 0.10)', border: '2px solid #F6EFF7' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#C6AECD' }}>
                {timer.phase === 'break'
                  ? timer.running
                    ? 'break · relax'
                    : 'break · paused'
                  : timer.running
                    ? 'focusing…'
                    : 'paused'}
              </div>
              <div style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: '30px', lineHeight: 1, color: '#4A3B52', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(timer.total - timer.left)} <span style={{ fontSize: '18px', color: '#C6AECD', fontWeight: 800 }}>/ {formatTime(timer.total)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={toggleTimer}
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  borderRadius: '15px',
                  background: '#DBF0BA',
                  color: '#5E7A2E',
                  fontSize: '17px',
                  fontWeight: 900,
                  boxShadow: '0 5px 0 #C4E29A',
                  transition: 'transform 0.12s ease',
                }}
              >
                {timer.running ? 'II' : '▶'}
              </button>
              <button
                onClick={resetTimer}
                title="end session"
                style={{
                  border: 'none',
                  cursor: 'pointer',
                  width: '44px',
                  height: '44px',
                  borderRadius: '15px',
                  background: '#F1E9F6',
                  color: '#9B84A6',
                  fontSize: '15px',
                  fontWeight: 900,
                  transition: 'transform 0.12s ease',
                }}
              >
                ↺
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={toggleSessionPopup}
            style={{
              cursor: 'pointer',
              border: 'none',
              background: '#F5A0C4',
              color: '#fff',
              borderRadius: '20px',
              padding: '15px 26px',
              fontWeight: 900,
              fontSize: '16px',
              boxShadow: '0 8px 0 #E27FAB, 0 14px 26px rgba(245, 160, 196, 0.5)',
              transition: 'transform 0.12s ease',
            }}
          >
            start session
          </button>
        )}
      </div>
    </header>
  );
}
