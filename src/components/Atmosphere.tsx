export function Atmosphere() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {/* Floating shape 1 - pink */}
      <div
        style={{
          position: 'absolute',
          top: '88px',
          left: '-40px',
          width: '200px',
          height: '180px',
          background: '#FFCBE1',
          opacity: 0.5,
          borderRadius: '46% 54% 63% 37% / 42% 45% 55% 58%',
          animation: 'ffFloat 11s ease-in-out infinite',
          '--r': '-8deg',
        } as React.CSSProperties}
      />

      {/* Floating shape 2 - blue */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          right: '-56px',
          width: '230px',
          height: '210px',
          background: '#D0E6F7',
          opacity: 0.5,
          borderRadius: '58% 42% 40% 60% / 52% 56% 44% 48%',
          animation: 'ffFloat 13s ease-in-out infinite',
          '--r': '6deg',
        } as React.CSSProperties}
      />

      {/* Floating shape 3 - green */}
      <div
        style={{
          position: 'absolute',
          bottom: '-60px',
          left: '22%',
          width: '260px',
          height: '220px',
          background: '#DBF0BA',
          opacity: 0.45,
          borderRadius: '52% 48% 58% 42% / 46% 52% 48% 54%',
          animation: 'ffFloat 15s ease-in-out infinite',
          '--r': '4deg',
        } as React.CSSProperties}
      />

      {/* Floating emoji decorations */}
      <div
        style={{
          position: 'absolute',
          top: '150px',
          right: '24%',
          fontSize: '30px',
          color: '#F5A0C4',
          opacity: 0.55,
          animation: 'ffFloat 9s ease-in-out infinite',
        }}
      >
        ✨
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          right: '12%',
          fontSize: '24px',
          color: '#D3B6F0',
          opacity: 0.6,
          animation: 'ffFloat 10s ease-in-out infinite',
          '--r': '12deg',
        } as React.CSSProperties}
      >
        🌸
      </div>


      {/* SVG wave patterns */}
      <svg
        width="150"
        height="34"
        viewBox="0 0 150 34"
        fill="none"
        style={{
          position: 'absolute',
          top: '120px',
          left: '32%',
          opacity: 0.5,
        }}
      >
        <path d="M2 17 C 14 3, 26 3, 38 17 S 62 31, 74 17 S 98 3, 110 17 S 134 31, 148 17" stroke="#E5D8F2" strokeWidth="4" strokeLinecap="round" />
      </svg>

      <svg
        width="130"
        height="30"
        viewBox="0 0 130 30"
        fill="none"
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '8%',
          opacity: 0.5,
        }}
      >
        <path d="M2 15 C 12 4, 22 4, 32 15 S 52 26, 62 15 S 84 4, 94 15 S 118 26, 128 15" stroke="#FFCBE1" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
