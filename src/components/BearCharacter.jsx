const B  = '#C8904A';
const BD = '#A86E30';
const BN = '#7a4810';
const BP = '#FFB3C6';
const RB = '#FF85A1';
const RD = '#E8507A';
const EY = '#1a0808';

export default function BearCharacter({ size = 120, expression = 'normal' }) {
  const k = size / 120;
  const px = (n) => `${n * k}px`;

  const isSad   = expression === 'sad';
  const isHappy = expression === 'happy' || expression === 'excited';

  return (
    <div style={{ position: 'relative', width: px(120), height: px(140), flexShrink: 0 }}>

      {/* リボン */}
      <div style={{ position: 'absolute', left: px(24), top: px(2), width: px(28), height: px(16), backgroundColor: RB, borderRadius: px(8), transform: 'rotate(-30deg)' }} />
      <div style={{ position: 'absolute', left: px(68), top: px(2), width: px(28), height: px(16), backgroundColor: RB, borderRadius: px(8), transform: 'rotate(30deg)' }} />
      <div style={{ position: 'absolute', left: px(53), top: px(5), width: px(14), height: px(14), backgroundColor: RD, borderRadius: px(7) }} />

      {/* 耳 */}
      <div style={{ position: 'absolute', left: px(6),  top: px(18), width: px(36), height: px(36), backgroundColor: B,  borderRadius: px(18) }} />
      <div style={{ position: 'absolute', right: px(6), top: px(18), width: px(36), height: px(36), backgroundColor: B,  borderRadius: px(18) }} />
      <div style={{ position: 'absolute', left: px(14), top: px(26), width: px(20), height: px(20), backgroundColor: BD, borderRadius: px(10) }} />
      <div style={{ position: 'absolute', right: px(14),top: px(26), width: px(20), height: px(20), backgroundColor: BD, borderRadius: px(10) }} />

      {/* 顔 */}
      <div style={{ position: 'absolute', left: px(8), top: px(30), width: px(104), height: px(104), backgroundColor: B, borderRadius: px(52) }} />

      {/* 口周り */}
      <div style={{ position: 'absolute', left: px(36), top: px(84), width: px(48), height: px(34), backgroundColor: BD, borderRadius: px(24) }} />

      {/* 目 */}
      {isHappy ? (
        <>
          <div style={{ position: 'absolute', left: px(24), top: px(64), width: px(22), height: px(11), borderTopWidth: px(4), borderTopStyle: 'solid', borderTopColor: EY, borderRadius: px(11) }} />
          <div style={{ position: 'absolute', right: px(24), top: px(64), width: px(22), height: px(11), borderTopWidth: px(4), borderTopStyle: 'solid', borderTopColor: EY, borderRadius: px(11) }} />
        </>
      ) : (
        <>
          <div style={{ position: 'absolute', left: px(24), top: px(55), width: px(20), height: px(20), backgroundColor: EY, borderRadius: px(10) }} />
          <div style={{ position: 'absolute', right: px(24), top: px(55), width: px(20), height: px(20), backgroundColor: EY, borderRadius: px(10) }} />
          <div style={{ position: 'absolute', left: px(28), top: px(57), width: px(7), height: px(7), backgroundColor: '#fff', borderRadius: px(4) }} />
          <div style={{ position: 'absolute', right: px(28), top: px(57), width: px(7), height: px(7), backgroundColor: '#fff', borderRadius: px(4) }} />
          <div style={{ position: 'absolute', left: px(32), top: px(62), width: px(3), height: px(3), backgroundColor: '#fff', borderRadius: px(2) }} />
          <div style={{ position: 'absolute', right: px(32), top: px(62), width: px(3), height: px(3), backgroundColor: '#fff', borderRadius: px(2) }} />
          {isSad && (
            <>
              <div style={{ position: 'absolute', left: px(22), top: px(50), width: px(22), height: px(5), backgroundColor: EY, borderRadius: px(3), transform: 'rotate(15deg)' }} />
              <div style={{ position: 'absolute', right: px(22), top: px(50), width: px(22), height: px(5), backgroundColor: EY, borderRadius: px(3), transform: 'rotate(-15deg)' }} />
            </>
          )}
        </>
      )}

      {/* ほっぺ */}
      <div style={{ position: 'absolute', left: px(10),  top: px(72), width: px(24), height: px(14), backgroundColor: BP, borderRadius: px(12), opacity: 0.85 }} />
      <div style={{ position: 'absolute', right: px(10), top: px(72), width: px(24), height: px(14), backgroundColor: BP, borderRadius: px(12), opacity: 0.85 }} />

      {/* 鼻 */}
      <div style={{ position: 'absolute', left: px(50), top: px(86), width: px(20), height: px(13), backgroundColor: BN, borderRadius: px(7) }} />

      {/* 口 */}
      {isSad ? (
        <div style={{ position: 'absolute', left: px(40), top: px(106), width: px(40), height: px(18), borderTopWidth: px(3), borderTopStyle: 'solid', borderTopColor: BN, borderRadius: px(20) }} />
      ) : (
        <div style={{ position: 'absolute', left: px(40), top: px(100), width: px(40), height: px(18), borderBottomWidth: px(3), borderBottomStyle: 'solid', borderBottomColor: BN, borderRadius: px(20) }} />
      )}

    </div>
  );
}
