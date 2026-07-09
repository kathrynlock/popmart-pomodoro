
import { useAppState, useAppActions } from '../../context/AppContext';

export function SessionCompleteModal() {
  const { state } = useAppState();
  const { toggleBlindbox, completeBreakPhase, startWork, closeComplete } = useAppActions();

  if (!state.showSessionComplete) return null;

  const ck = state.completeKind;
  const bm = Math.round((state.timer.brk || 0) / 60);

  let title = 'nice work!';
  let text = '';
  let primaryLabel = '';
  let primary = () => {};
  let showUnbox = false;
  let finishLabel = 'save it for later';

  if (ck === 'pomo-break') {
    title = "break's over!";
    text = 'feeling refreshed? let\'s do one more focus block.';
    primaryLabel = 'start focus';
    primary = startWork;
    finishLabel = 'i\'m done for now';
  } else if (ck === 'pomo-work') {
    title = 'focus block done!';
    text = `lovely work -- your blind box is ready. take a ${bm}-min break?`;
    primaryLabel = `take a ${bm} min break`;
    primary = completeBreakPhase;
    showUnbox = true;
    finishLabel = 'finish for now';
  } else {
    title = 'nice work!';
    text = 'you focused beautifully and earned your blind box -- time to unbox it';
    primaryLabel = 'open my blind box';
    primary = () => {
      closeComplete();
      toggleBlindbox();
    };
    finishLabel = 'save it for later';
  }

  return (
    <div
      onClick={closeComplete}
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
          padding: '38px 36px',
          width: '420px',
          maxWidth: '100%',
          boxShadow: '0 30px 70px rgba(74, 59, 82, 0.28)',
          animation: 'ffModalIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '30px' }}>
          {title}
        </div>
        <div style={{ fontSize: '15px', color: '#9B84A6', fontWeight: 700, marginTop: '6px', lineHeight: '1.45' }}>
          {text}
        </div>

        <button
          onClick={primary}
          style={{
            marginTop: '26px',
            width: '100%',
            border: 'none',
            cursor: 'pointer',
            background: '#FFC58A',
            color: '#8A521E',
            borderRadius: '20px',
            padding: '16px',
            fontWeight: 900,
            fontSize: '17px',
            boxShadow: '0 7px 0 #F0AE6C',
            transition: 'all 0.12s ease',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(4px)';
            e.currentTarget.style.boxShadow = '0 3px 0 #F0AE6C';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '0 7px 0 #F0AE6C';
          }}
        >
          {primaryLabel}
        </button>

        {showUnbox && (
          <button
            onClick={toggleBlindbox}
            style={{
              marginTop: '12px',
              width: '100%',
              border: 'none',
              cursor: 'pointer',
              background: '#D3B6F0',
              color: '#5B3E77',
              borderRadius: '20px',
              padding: '14px',
              fontWeight: 900,
              fontSize: '15px',
              boxShadow: '0 6px 0 #BE9BE0',
              transition: 'all 0.12s ease',
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(3px)';
              e.currentTarget.style.boxShadow = '0 3px 0 #BE9BE0';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 6px 0 #BE9BE0';
            }}
          >
            unbox now
          </button>
        )}

        <button
          onClick={closeComplete}
          style={{
            marginTop: '14px',
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
          {finishLabel}
        </button>
      </div>
    </div>
  );
}
