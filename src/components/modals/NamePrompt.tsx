import { useState } from 'react';

interface NamePromptProps {
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

export function NamePrompt({ onSubmit, onSkip }: NamePromptProps) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(74, 59, 82, 0.35)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (trimmed) onSubmit(trimmed);
        }}
        style={{
          background: '#fff',
          borderRadius: '26px',
          padding: '28px 30px 24px',
          width: 'min(380px, 90vw)',
          boxShadow: '0 20px 50px rgba(74, 59, 82, 0.25)',
          border: '2px solid #F6EFF7',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        <div style={{ fontFamily: 'Fredoka, sans-serif', fontWeight: 600, fontSize: '28px', color: '#4A3B52' }}>
          hey there!
        </div>
        <div style={{ fontSize: '14px', fontWeight: 800, color: '#B29BB8' }}>
          what should we call you?
        </div>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          placeholder="your name"
          style={{
            border: '2px solid #F1E9F6',
            borderRadius: '14px',
            padding: '12px 14px',
            fontSize: '16px',
            fontWeight: 800,
            color: '#4A3B52',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' }}>
          <button
            type="button"
            onClick={onSkip}
            style={{ border: 'none', cursor: 'pointer', background: '#F4EEF8', color: '#9B84A6', borderRadius: '14px', padding: '10px 16px', fontWeight: 800, fontSize: '14px' }}
          >
            skip
          </button>
          <button
            type="submit"
            disabled={!trimmed}
            style={{
              border: 'none',
              cursor: trimmed ? 'pointer' : 'default',
              background: '#F5A0C4',
              color: '#fff',
              borderRadius: '14px',
              padding: '10px 20px',
              fontWeight: 900,
              fontSize: '14px',
              opacity: trimmed ? 1 : 0.5,
            }}
          >
            continue
          </button>
        </div>
      </form>
    </div>
  );
}
