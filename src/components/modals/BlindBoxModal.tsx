import { useState } from 'react';
import { useAppState, useAppActions } from '../../context/AppContext';
import { useFigures } from '../../hooks/useFigures';
import { useParticleEffects } from '../../hooks/useParticleEffects';
import { BLIND_BOXES } from '../../data/figures';

export function BlindBoxModal() {
  const { state } = useAppState();
  const { toggleBlindbox, toggleCollection, blindBoxShake, blindBoxReveal, blindBoxNext } = useAppActions();
  const { pickRandomFigure, activeSets } = useFigures();
  const [hoveredSetId, setHoveredSetId] = useState<string | null>(null);
  const hoveredSet = activeSets.find(set => set.id === hoveredSetId);
  const { confetti, sparkles } = useParticleEffects();
  const reduceMotionRef = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleOpenBox = (setId: string) => {
    blindBoxShake();

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.44;

    // Sparkles during shake
    let sparkleInterval: ReturnType<typeof setInterval> | null = null;
    sparkleInterval = setInterval(() => {
      sparkles(cx, cy, { count: 6, jitter: 90, power: 3 });
    }, 160);

    // After shake animation, reveal the figure
    setTimeout(() => {
      if (sparkleInterval) clearInterval(sparkleInterval);

      const fig = pickRandomFigure(setId);
      blindBoxReveal(fig);

      const isSecret = fig.rarity === 'secret';
      const sparkleCount = isSecret ? 90 : 45;
      const sparkleColors = isSecret ? ['#FFE7A8', '#FFD27A', '#FFF0C4', '#FFC58A', '#FFF6D6'] : undefined;
      const confettiCount = isSecret ? 160 : 80;
      const confettiPower = isSecret ? 13 : 9;
      const confettiPalette = isSecret
        ? ['#FFE7A8', '#FFD27A', '#FFC58A', '#FFF0C4', '#FAF2A8']
        : ['#FFCBE1', '#F5A0C4', '#FFDAB5', '#FFC58A', '#FAF2A8', '#FFEB7A', '#DBF0BA', '#CFF295', '#D0E6F7', '#A4D1F2', '#E5D8F2', '#D3B6F0'];

      sparkles(cx, cy, { count: sparkleCount, power: isSecret ? 8 : 6, jitter: 30, colors: sparkleColors });
      confetti(cx, cy - 20, { count: confettiCount, power: confettiPower, palette: confettiPalette });
    }, reduceMotionRef ? 350 : 1700);
  };

  const handleNextBox = () => {
    blindBoxNext();
  };

  if (!state.showBlindbox) return null;

  const curBox = BLIND_BOXES[state.bbBox] || BLIND_BOXES[0];
  const fig = state.bbFigure;
  const isSecret = fig?.rarity === 'secret';
  const rarityText = { common: 'common', rare: 'rare', secret: 'secret' };
  const revealNotes = {
    common: 'a lovely everyday little friend',
    rare: 'ooh, a rare one — lucky you!',
    secret: 'incredibly rare. this one shimmers!',
  };
  const pendingCount = state.pending.length;

  return (
    <div
      onClick={toggleBlindbox}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 70,
        background: 'rgba(74, 59, 82, 0.42)',
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
          background: 'linear-gradient(180deg, #FFFDF9, #FDF4FA)',
          borderRadius: '32px',
          padding: '34px 36px 30px',
          width: '520px',
          maxWidth: '100%',
          boxShadow: '0 34px 80px rgba(74, 59, 82, 0.35)',
          animation: 'ffModalIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1.2)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <button
          onClick={toggleBlindbox}
          style={{
            position: 'absolute',
            top: '16px',
            right: '18px',
            border: 'none',
            cursor: 'pointer',
            background: '#F4EEF8',
            color: '#9B84A6',
            width: '34px',
            height: '34px',
            borderRadius: '12px',
            fontSize: '17px',
            fontWeight: 900,
            zIndex: 3,
          }}
        >
          ×
        </button>

        {state.bbPhase === 'ready' && (
          <div>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '28px' }}>
              your blind box is here!
            </div>
            <div style={{ fontSize: '14px', color: '#A695AE', fontWeight: 700, marginTop: '4px' }}>
              pick a box to open
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '14px',
                marginTop: '20px',
                maxHeight: '380px',
                overflowY: 'auto',
                padding: '4px',
              }}
            >
              {activeSets.map(set => (
                <button
                  key={set.id}
                  onClick={() => handleOpenBox(set.id)}
                  title={`open a ${set.name} box`}
                  style={{ border: 'none', cursor: 'pointer', background: 'transparent', padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'filter 0.15s ease', filter: hoveredSetId === set.id ? 'brightness(1.06) drop-shadow(0 6px 10px rgba(74, 59, 82, 0.2))' : 'none' }}
                  onMouseEnter={() => setHoveredSetId(set.id)}
                  onMouseLeave={() => setHoveredSetId(null)}
                  onFocus={() => setHoveredSetId(set.id)}
                  onBlur={() => setHoveredSetId(null)}
                >
                  {set.box ? (
                    <img
                      src={set.box}
                      alt={set.name}
                      style={{ width: '100%', aspectRatio: '1', objectFit: 'contain', mixBlendMode: 'multiply' }}
                    />
                  ) : (
                    <div style={{ width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ position: 'relative', width: '62%', height: '58%', borderRadius: '16px', background: curBox.color, boxShadow: '0 10px 20px rgba(74, 59, 82, 0.2)' }}>
                        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '16px', marginLeft: '-8px', background: 'rgba(255,255,255,.7)' }} />
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '16px', marginTop: '-8px', background: 'rgba(255,255,255,.7)' }} />
                      </div>
                    </div>
                  )}
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#8C74A0', lineHeight: 1.25 }}>{set.name.replace(/^Nyota\s*[—×-]?\s*/, '')}</div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '16px', height: '150px', boxSizing: 'border-box', padding: '12px 14px', borderRadius: '20px', background: '#FBF4FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {hoveredSet ? (
                <>
                  <div style={{ fontSize: '11px', fontWeight: 900, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#C6AECD' }}>
                    who could be inside
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
                    {hoveredSet.figures.map(f => (
                      <div
                        key={f.id}
                        title={f.rarity === 'secret' ? 'secret figure' : f.name}
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '14px',
                          background: f.rarity === 'secret' ? 'linear-gradient(135deg, #FFE7A8, #FFD27A)' : f.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          fontFamily: 'Fredoka, sans-serif',
                          fontWeight: 600,
                          fontSize: '22px',
                          color: '#A9711F',
                        }}
                      >
                        {f.rarity === 'secret' ? (
                          '?'
                        ) : (
                          <img src={f.img} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.3)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: '13px', color: '#C3B1CB', fontWeight: 800 }}>hover a box to see who's inside</div>
              )}
            </div>
          </div>
        )}

        {state.bbPhase === 'shake' && (
          <div style={{ padding: '30px 0 20px' }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '26px', color: '#8C74A0' }}>
              ooh… what could it be?
            </div>
            <div style={{ marginTop: '34px', marginBottom: '22px', width: '150px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginLeft: 'auto', marginRight: 'auto' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: '-16px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(255,197,138,.6), transparent 70%)',
                  filter: 'blur(6px)',
                  animation: 'ffBreathe 1.1s ease-in-out infinite',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  width: '126px',
                  height: '116px',
                  borderRadius: '22px',
                  background: curBox.color,
                  boxShadow: '0 14px 28px rgba(74, 59, 82, 0.2)',
                  animation: 'ffBoxShake 0.42s ease-in-out infinite',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '22px', marginLeft: '-11px', background: 'rgba(255,255,255,.7)' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '22px', marginTop: '-11px', background: 'rgba(255,255,255,.7)' }} />
              </div>
            </div>
            <div style={{ fontSize: '14px', color: '#B7A6BE', fontWeight: 800, letterSpacing: '0.5px' }}>
              hold tight…
            </div>
          </div>
        )}

        {state.bbPhase === 'reveal' && fig && (
          <div>
            {isSecret && (
              <div
                style={{
                  display: 'inline-block',
                  marginBottom: '10px',
                  padding: '6px 18px',
                  borderRadius: '20px',
                  fontFamily: 'Fredoka, sans-serif',
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#8A521E',
                  background: 'linear-gradient(90deg, #FFE7A8, #FFD27A, #FFE9B0, #FFD27A)',
                  backgroundSize: '220% 100%',
                  animation: 'ffShimmer 2.2s linear infinite',
                  boxShadow: '0 6px 16px rgba(255, 197, 138, 0.6)',
                }}
              >
                SECRET FIND
              </div>
            )}

            <div style={{ position: 'relative', marginTop: '8px', marginBottom: '6px', width: '200px', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: isSecret
                    ? 'radial-gradient(circle, rgba(255,210,122,.75), transparent 68%)'
                    : 'radial-gradient(circle, rgba(255,203,225,.7), transparent 68%)',
                }}
              />
              {isSecret && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '-8px',
                    borderRadius: '50%',
                    background: 'conic-gradient(from 0deg, #FFE7A8, #FFC58A, #FFF0C4, #FFC58A, #FFE7A8)',
                    opacity: 0.55,
                    filter: 'blur(3px)',
                    animation: 'ffRing 5s linear infinite',
                  }}
                />
              )}
              <div
                style={{
                  position: 'relative',
                  width: '150px',
                  height: '150px',
                  borderRadius: '36px',
                  background: fig.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 14px 30px rgba(74, 59, 82, 0.18)',
                  animation: 'ffPop 0.6s cubic-bezier(0.2, 0.9, 0.3, 1.5)',
                }}
              >
                <div style={{ width: '118px', height: '118px', overflow: 'hidden' }}>
                  <img
                    src={fig.img}
                    alt={fig.name}
                    style={{ width: '100%', height: '100%', objectFit: 'contain', transform: 'scale(1.35)' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '30px', marginTop: '8px', color: '#4A3B52' }}>
              {fig.name}
            </div>

            {fig.rarity !== 'common' && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '8px', padding: '5px 14px', borderRadius: '16px', background: isSecret ? '#FFE7A8' : '#F4EEF8', color: isSecret ? '#A9711F' : '#9B84A6', fontWeight: 900, fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                {rarityText[fig.rarity]}
              </div>
            )}

            <div style={{ fontSize: '14px', color: '#A695AE', fontWeight: 700, marginTop: '12px' }}>
              {revealNotes[fig.rarity]}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '22px' }}>
              <button
                onClick={toggleCollection}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  background: '#F4EEF8',
                  color: '#8C74A0',
                  borderRadius: '18px',
                  padding: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  transition: 'background 0.2s ease',
                }}
              >
                see my shelf
              </button>
              <button
                onClick={() => {
                  if (pendingCount > 0) {
                    handleNextBox();
                  } else {
                    toggleBlindbox();
                  }
                }}
                style={{
                  flex: 1,
                  border: 'none',
                  cursor: 'pointer',
                  background: pendingCount > 0 ? '#FFC58A' : '#F4EEF8',
                  color: pendingCount > 0 ? '#8A521E' : '#9B84A6',
                  borderRadius: '18px',
                  padding: '14px',
                  fontWeight: 900,
                  fontSize: '15px',
                  boxShadow: pendingCount > 0 ? '0 5px 0 #F0AE6C' : 'none',
                  transition: 'all 0.12s ease',
                }}
                onMouseDown={(e) => {
                  if (pendingCount > 0) {
                    e.currentTarget.style.transform = 'translateY(3px)';
                    e.currentTarget.style.boxShadow = '0 2px 0 #F0AE6C';
                  }
                }}
                onMouseUp={(e) => {
                  if (pendingCount > 0) {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = '0 5px 0 #F0AE6C';
                  }
                }}
              >
                {pendingCount > 0 ? `open another (×${pendingCount})` : 'all done!'}
              </button>
            </div>
          </div>
        )}

        {state.bbPhase === 'empty' && (
          <div style={{ padding: '26px 10px' }}>
            <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '24px', marginTop: '8px' }}>
              no boxes yet!
            </div>
            <div style={{ fontSize: '14px', color: '#A695AE', fontWeight: 700, marginTop: '6px', lineHeight: '1.45' }}>
              finish a focus session to earn a blind box.
              <br />
              your shelf is waiting
            </div>
            <button
              onClick={toggleBlindbox}
              style={{
                marginTop: '22px',
                border: 'none',
                cursor: 'pointer',
                background: '#F5A0C4',
                color: '#fff',
                borderRadius: '16px',
                padding: '13px 26px',
                fontWeight: 900,
                fontSize: '15px',
                boxShadow: '0 5px 0 #E27FAB',
                transition: 'all 0.12s ease',
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(3px)';
                e.currentTarget.style.boxShadow = '0 2px 0 #E27FAB';
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 5px 0 #E27FAB';
              }}
            >
              let's focus
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
